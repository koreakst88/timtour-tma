import { supabase } from '@/lib/supabase'

type SendTelegramMessageOptions = {
  reply_markup?: Record<string, unknown>
  parse_mode?: 'HTML' | 'Markdown'
}

type TelegramSendResult = {
  ok: boolean
  status: 'sent' | 'skipped' | 'failed'
  details?: string
}

type BookingNotificationPayload = {
  userTgId?: string | null
  userName?: string | null
  tourTitle?: string | null
  travelDate?: string | null
  status: 'processing' | 'confirmed' | 'rejected'
}

type ReviewNotificationPayload = {
  tourTitle: string
  rating: number
  text: string
}

function normalizeName(value?: string | null) {
  const normalized = value?.trim()
  if (!normalized || normalized.length < 2) return null
  if (/^(user|telegram|guest|пользователь)$/i.test(normalized)) return null
  return normalized
}

async function getFallbackUserName(tgId?: string | null) {
  if (!tgId) return null

  try {
    const { data } = await supabase
      .from('bot_users')
      .select('first_name, username')
      .eq('tg_id', tgId)
      .limit(1)
      .maybeSingle()

    return normalizeName(data?.first_name) ?? normalizeName(data?.username) ?? null
  } catch (error) {
    console.error('Failed to load fallback Telegram user name', error)
    return null
  }
}

function formatNamePrefix(name?: string | null) {
  return name ? `${name}, ` : ''
}

function formatTravelDateLine(value?: string | null) {
  if (!value?.trim()) return ''
  return `\n📅 Дата: ${value.trim()}`
}

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  options?: SendTelegramMessageOptions,
) : Promise<TelegramSendResult> {
  const botToken = process.env.BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN

  if (!chatId) {
    console.warn('[telegram] skipped: missing chat id')
    return {
      ok: false,
      status: 'skipped',
      details: 'missing chat id',
    }
  }

  if (!botToken) {
    console.warn('[telegram] skipped: missing bot token in Vercel env')
    return {
      ok: false,
      status: 'skipped',
      details: 'missing bot token',
    }
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...options,
      }),
    })

    const responseText = await response.text()
    console.log('[telegram] api response', {
      chatId,
      httpStatus: response.status,
      body: responseText,
    })

    if (!response.ok) {
      return {
        ok: false,
        status: 'failed',
        details: responseText,
      }
    }

    return {
      ok: true,
      status: 'sent',
      details: responseText,
    }
  } catch (error) {
    console.error('Failed to send Telegram message', error)
    return {
      ok: false,
      status: 'failed',
      details: error instanceof Error ? error.message : 'unknown error',
    }
  }
}

export async function notifyBookingStatusChanged(payload: BookingNotificationPayload) {
  if (!payload.userTgId) return

  const resolvedName =
    normalizeName(payload.userName) ?? (await getFallbackUserName(payload.userTgId))
  const namePrefix = formatNamePrefix(resolvedName)

  let message = ''

  if (payload.status === 'processing') {
    message = `🔄 ${namePrefix}ваша заявка в обработке.\nМенеджер свяжется с вами в ближайшее время.`
  }

  if (payload.status === 'confirmed') {
    message =
      `✅ ${namePrefix}заявка подтверждена!\n` +
      `✈️ Тур: ${payload.tourTitle ?? 'Тур'}` +
      `${formatTravelDateLine(payload.travelDate)}\n` +
      `По вопросам: @TimTour_WW`
  }

  if (payload.status === 'rejected') {
    message =
      `❌ ${namePrefix}к сожалению тур недоступен.\n` +
      `Мы предложим альтернативу. @TimTour_WW`
  }

  if (!message) return

  return sendTelegramMessage(payload.userTgId, message)
}

export async function notifyManagerAboutReview(payload: ReviewNotificationPayload) {
  const managerChatId = process.env.MANAGER_TG_ID
  if (!managerChatId) return

  const stars = '★'.repeat(payload.rating) + '☆'.repeat(5 - payload.rating)
  const message = `⭐ Новый отзыв на тур "${payload.tourTitle}"\nОценка: ${stars}\nТекст: ${payload.text}`

  return sendTelegramMessage(managerChatId, message)
}
