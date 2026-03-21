import WebApp from '@twa-dev/sdk'

// Инициализация TMA
export const initTelegram = () => {
  WebApp.ready()
  WebApp.expand()
}

// Получить данные пользователя из Telegram
export const getTelegramUser = () => {
  return WebApp.initDataUnsafe?.user ?? null
}

// Проверить является ли пользователь менеджером
export const isAdmin = () => {
  const adminId = process.env.NEXT_PUBLIC_ADMIN_TG_ID
  const user = getTelegramUser()
  if (!user || !adminId) return false
  return String(user.id) === adminId
}

// Закрыть TMA
export const closeTMA = () => {
  WebApp.close()
}

// Открыть внешнюю ссылку
export const openLink = (url: string) => {
  WebApp.openLink(url)
}
