'use server'

import { supabase } from '@/lib/supabase'

export type BookingData = {
  tourId: string
  tourTitle: string
  userTgId: string
  userName: string
  phone: string
  comment?: string
  travelDate: string
  peopleCount: number
}

export async function createBooking(data: BookingData): Promise<string> {
  // 1. Сохраняем в Supabase
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      tour_id: data.tourId,
      user_tg_id: data.userTgId,
      user_name: data.userName,
      phone: data.phone,
      comment: data.comment,
      travel_date: data.travelDate,
      people_count: data.peopleCount,
      status: 'new',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // 2. Уведомление менеджеру в Telegram
  const managerChatId = process.env.MANAGER_TG_ID
  const botToken = process.env.BOT_TOKEN

  if (managerChatId && botToken) {
    const message = `
🆕 <b>Новая заявка!</b>

👤 Имя: ${data.userName}
📞 Телефон: ${data.phone}
✈️ Тур: ${data.tourTitle}
📅 Дата: ${data.travelDate}
👥 Человек: ${data.peopleCount}
💬 Комментарий: ${data.comment || 'нет'}

#заявка_${booking.id.slice(0, 8)}
    `.trim()

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '✉️ Написать клиенту',
            url: `tg://user?id=${data.userTgId}`,
          },
        ],
      ],
    }

    try {
      await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: managerChatId,
            text: message,
            parse_mode: 'HTML',
            reply_markup: keyboard,
          }),
        },
      )
    } catch {
      // не блокируем ответ если Telegram недоступен
      console.error('Failed to notify manager via Telegram')
    }
  }

  return booking.id
}
