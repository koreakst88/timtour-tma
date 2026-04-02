'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { notifyBookingStatusChanged } from '@/lib/telegram-notifications'

type ProgramPayload = {
  day_number: number
  title: string
  description: string | null
}

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdminAccess()

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status, user_tg_id, user_name, travel_date, tour:tours(title)')
    .eq('id', bookingId)
    .maybeSingle()

  if (!booking || booking.status === status) {
    console.log('[booking-status] skipped', {
      bookingId,
      reason: !booking ? 'booking not found' : 'status did not change',
      oldStatus: booking?.status ?? null,
      newStatus: status,
    })
    revalidatePath('/admin')
    revalidatePath('/admin/bookings')
    return
  }

  console.log('[booking-status] updating', {
    bookingId,
    oldStatus: booking.status,
    newStatus: status,
    userTgId: booking.user_tg_id,
  })

  await supabase.from('bookings').update({ status }).eq('id', bookingId)

  if (status === 'processing' || status === 'confirmed' || status === 'rejected') {
    const rawTour = booking.tour as { title?: string } | { title?: string }[] | null | undefined
    const tourTitle = Array.isArray(rawTour) ? rawTour[0]?.title : rawTour?.title
    const notificationPreview =
      status === 'processing'
        ? `🔄 ${booking.user_name ? `${booking.user_name}, ` : ''}ваша заявка в обработке.\nМенеджер свяжется с вами в ближайшее время.`
        : status === 'confirmed'
          ? `✅ ${booking.user_name ? `${booking.user_name}, ` : ''}заявка подтверждена!\n✈️ Тур: ${tourTitle ?? 'Тур'}${booking.travel_date ? `\n📅 Дата: ${booking.travel_date}` : ''}\nПо вопросам: @TimTour_WW`
          : `❌ ${booking.user_name ? `${booking.user_name}, ` : ''}к сожалению тур недоступен.\nМы предложим альтернативу. @TimTour_WW`

    console.log('[booking-status] sending telegram notification', {
      bookingId,
      oldStatus: booking.status,
      newStatus: status,
      userTgId: booking.user_tg_id,
      text: notificationPreview,
    })

    const notificationResult = await notifyBookingStatusChanged({
      userTgId: booking.user_tg_id,
      userName: booking.user_name,
      tourTitle,
      travelDate: booking.travel_date,
      status,
    })

    console.log('[booking-status] telegram result', {
      bookingId,
      oldStatus: booking.status,
      newStatus: status,
      userTgId: booking.user_tg_id,
      result: notificationResult ?? null,
    })
  }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
}

export async function updateReviewVisibility(reviewId: string, isVisible: boolean) {
  await requireAdminAccess()

  await supabase
    .from('reviews')
    .update({ is_visible: isVisible })
    .eq('id', reviewId)

  revalidatePath('/admin')
  revalidatePath('/admin/reviews')
}

export async function toggleTourVisibility(tourId: string) {
  await requireAdminAccess()

  const { data: tour } = await supabase.from('tours').select('is_active').eq('id', tourId).single()

  await supabase
    .from('tours')
    .update({ is_active: !tour?.is_active })
    .eq('id', tourId)

  revalidatePath('/admin')
  revalidatePath('/admin/tours')
  revalidatePath('/catalog')
  revalidatePath('/client')
}

export async function deleteTour(tourId: string) {
  await requireAdminAccess()

  await supabase.from('tour_media').delete().eq('tour_id', tourId)
  await supabase.from('tour_dates').delete().eq('tour_id', tourId)
  await supabase.from('tours').delete().eq('id', tourId)

  revalidatePath('/admin')
  revalidatePath('/admin/tours')
  revalidatePath('/catalog')
  revalidatePath('/client')
}

async function uploadTourPhotos(tourId: string, files: File[]) {
  for (const file of files) {
    if (!file || file.size === 0) continue

    const arrayBuffer = await file.arrayBuffer()
    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const path = `${tourId}/${randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('tour-media')
      .upload(path, arrayBuffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Failed to upload tour media', uploadError)
      continue
    }

    const { data: publicUrlData } = supabase.storage.from('tour-media').getPublicUrl(path)

    await supabase.from('tour_media').insert({
      tour_id: tourId,
      url: publicUrlData.publicUrl,
      type: 'photo',
      order: 0,
    })
  }
}

function parseHighlights(formData: FormData) {
  return String(formData.get('highlights_text') ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseProgram(formData: FormData): ProgramPayload[] {
  const dayNumbers = formData.getAll('program_day_number')
  const titles = formData.getAll('program_title')
  const descriptions = formData.getAll('program_description')

  return titles
    .map((value, index) => {
      const title = String(value ?? '').trim()
      const description = String(descriptions[index] ?? '').trim()
      const dayNumber = Number(dayNumbers[index] ?? index + 1)

      if (!title && !description) return null

      return {
        day_number: Number.isFinite(dayNumber) && dayNumber > 0 ? dayNumber : index + 1,
        title: title || `День ${index + 1}`,
        description: description || null,
      }
    })
    .filter((item): item is ProgramPayload => item !== null)
}

async function replaceTourProgram(tourId: string, formData: FormData) {
  const program = parseProgram(formData)

  await supabase.from('tour_program').delete().eq('tour_id', tourId)

  if (program.length === 0) return

  await supabase.from('tour_program').insert(
    program.map((day) => ({
      tour_id: tourId,
      ...day,
    })),
  )
}

export async function createTour(formData: FormData) {
  await requireAdminAccess()

  const title = String(formData.get('title') ?? '').trim()
  const countryId = String(formData.get('country_id') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const price = String(formData.get('price') ?? '').trim()
  const durationDays = Number(formData.get('duration_days') ?? 0)
  const type = String(formData.get('type') ?? 'group')
  const category = String(formData.get('category') ?? 'international')
  const hasIndividual = formData.get('has_individual') === 'on'
  const individualPriceFrom = String(formData.get('individual_price_from') ?? '').trim()
  const individualDescription = String(formData.get('individual_description') ?? '').trim()
  const bookingTerms = String(formData.get('booking_terms') ?? '').trim()
  const cancellationTerms = String(formData.get('cancellation_terms') ?? '').trim()
  const highlights = parseHighlights(formData)
  const photos = formData.getAll('photos').filter((item): item is File => item instanceof File)

  if (!title || !countryId || !description || !price || !durationDays) {
    redirect('/admin/tours/new')
  }

  const { data: createdTour } = await supabase
    .from('tours')
    .insert({
      title,
      country_id: countryId,
      description,
      price,
      duration_days: durationDays,
      type,
      category,
      has_individual: hasIndividual,
      individual_price_from: hasIndividual ? individualPriceFrom || null : null,
      individual_description: hasIndividual ? individualDescription || null : null,
      booking_terms: bookingTerms || null,
      cancellation_terms: cancellationTerms || null,
      highlights,
      is_active: true,
    })
    .select('id')
    .single()

  if (createdTour?.id) {
    await replaceTourProgram(createdTour.id, formData)
    await uploadTourPhotos(createdTour.id, photos)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/tours')
  revalidatePath('/catalog')
  revalidatePath('/client')
  redirect('/admin/tours')
}

export async function updateTour(tourId: string, formData: FormData) {
  await requireAdminAccess()

  const title = String(formData.get('title') ?? '').trim()
  const countryId = String(formData.get('country_id') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const price = String(formData.get('price') ?? '').trim()
  const durationDays = Number(formData.get('duration_days') ?? 0)
  const type = String(formData.get('type') ?? 'group')
  const category = String(formData.get('category') ?? 'international')
  const hasIndividual = formData.get('has_individual') === 'on'
  const individualPriceFrom = String(formData.get('individual_price_from') ?? '').trim()
  const individualDescription = String(formData.get('individual_description') ?? '').trim()
  const bookingTerms = String(formData.get('booking_terms') ?? '').trim()
  const cancellationTerms = String(formData.get('cancellation_terms') ?? '').trim()
  const highlights = parseHighlights(formData)
  const photos = formData.getAll('photos').filter((item): item is File => item instanceof File)

  await supabase
    .from('tours')
    .update({
      title,
      country_id: countryId,
      description,
      price,
      duration_days: durationDays,
      type,
      category,
      has_individual: hasIndividual,
      individual_price_from: hasIndividual ? individualPriceFrom || null : null,
      individual_description: hasIndividual ? individualDescription || null : null,
      booking_terms: bookingTerms || null,
      cancellation_terms: cancellationTerms || null,
      highlights,
    })
    .eq('id', tourId)

  await replaceTourProgram(tourId, formData)

  if (photos.length > 0) {
    await uploadTourPhotos(tourId, photos)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/tours')
  revalidatePath('/catalog')
  revalidatePath(`/tour/${tourId}`)
  redirect('/admin/tours')
}
