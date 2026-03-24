'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdminAccess()

  await supabase.from('bookings').update({ status }).eq('id', bookingId)

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')
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

export async function createTour(formData: FormData) {
  await requireAdminAccess()

  const title = String(formData.get('title') ?? '').trim()
  const countryId = String(formData.get('country_id') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const price = String(formData.get('price') ?? '').trim()
  const durationDays = Number(formData.get('duration_days') ?? 0)
  const type = String(formData.get('type') ?? 'group')
  const category = String(formData.get('category') ?? 'international')
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
      is_active: true,
    })
    .select('id')
    .single()

  if (createdTour?.id) {
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
    })
    .eq('id', tourId)

  if (photos.length > 0) {
    await uploadTourPhotos(tourId, photos)
  }

  revalidatePath('/admin')
  revalidatePath('/admin/tours')
  revalidatePath('/catalog')
  revalidatePath(`/tour/${tourId}`)
  redirect('/admin/tours')
}
