'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ADMIN_TG_COOKIE } from '@/lib/admin-constants'
import { supabase } from '@/lib/supabase'

type SubmitReviewInput = {
  tourId: string
  tourTitle: string
  userTgId?: string
  userName?: string
  rating: number
  text: string
}

type SubmitReviewResult = {
  ok: boolean
  message: string
}

export async function submitReview(data: SubmitReviewInput): Promise<SubmitReviewResult> {
  const cookieStore = await cookies()
  const tgId = cookieStore.get(ADMIN_TG_COOKIE)?.value ?? data.userTgId ?? null
  const reviewText = data.text.trim()

  if (!tgId) {
    return {
      ok: false,
      message: 'Не удалось определить пользователя Telegram',
    }
  }

  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    return {
      ok: false,
      message: 'Выберите оценку от 1 до 5',
    }
  }

  if (reviewText.length < 3) {
    return {
      ok: false,
      message: 'Добавьте текст отзыва',
    }
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id')
    .eq('user_tg_id', tgId)
    .eq('tour_id', data.tourId)
    .eq('status', 'confirmed')
    .limit(1)
    .maybeSingle()

  if (!booking) {
    return {
      ok: false,
      message: 'Отзыв можно оставить только после подтверждённого бронирования',
    }
  }

  const { error } = await supabase.from('reviews').insert({
    tour_id: data.tourId,
    user_tg_id: tgId,
    user_name: data.userName?.trim() || 'Путешественник',
    text: reviewText,
    rating: data.rating,
    is_visible: false,
  })

  if (error) {
    console.error('Failed to submit review', error)
    return {
      ok: false,
      message: 'Не удалось отправить отзыв',
    }
  }

  const managerChatId = process.env.MANAGER_TG_ID
  const botToken = process.env.BOT_TOKEN

  if (managerChatId && botToken) {
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
    const message = `
Новый отзыв на тур "${data.tourTitle}"
Оценка: ${stars}
Текст: ${reviewText}
    `.trim()

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: managerChatId,
          text: message,
        }),
      })
    } catch {
      console.error('Failed to notify manager about review')
    }
  }

  revalidatePath(`/tour/${data.tourId}`)
  revalidatePath('/admin')
  revalidatePath('/admin/reviews')

  return {
    ok: true,
    message: 'Спасибо! Отзыв отправлен на модерацию',
  }
}
