import { TelegramUser } from '@/types'

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  initDataUnsafe?: {
    user?: TelegramUser
  }
  openLink: (url: string) => void
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
    offClick: (fn: () => void) => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

let cachedWebApp: TelegramWebApp | null = null

const getWebApp = async (): Promise<TelegramWebApp | null> => {
  if (typeof window === 'undefined') return null
  if (window.Telegram?.WebApp) {
    cachedWebApp = window.Telegram.WebApp
    return cachedWebApp
  }
  if (!cachedWebApp) {
    const sdk = await import('@twa-dev/sdk')
    cachedWebApp = sdk.default as TelegramWebApp
  }
  return cachedWebApp
}

export const initTelegram = async () => {
  const app = await getWebApp()
  if (!app) return
  app.ready()
  app.expand()
}

export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? cachedWebApp?.initDataUnsafe?.user ?? null
}

export const isAdmin = (): boolean => {
  const adminId = process.env.NEXT_PUBLIC_ADMIN_TG_ID
  const user = getTelegramUser()
  if (!user || !adminId) return false
  return String(user.id) === adminId
}

export const openLink = (url: string) => {
  if (typeof window === 'undefined') return
  const app = window.Telegram?.WebApp ?? cachedWebApp
  if (app) {
    app.openLink(url)
  } else {
    window.open(url, '_blank')
  }
}
