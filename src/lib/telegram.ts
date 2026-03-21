import { TelegramUser } from '@/types'

let WebApp: any = null

const getWebApp = async () => {
  if (typeof window === 'undefined') return null
  if (!WebApp) {
    const module = await import('@twa-dev/sdk')
    WebApp = module.default
  }
  return WebApp
}

export const initTelegram = async () => {
  const app = await getWebApp()
  if (!app) return
  app.ready()
  app.expand()
}

export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window === 'undefined') return null
  try {
    const app = require('@twa-dev/sdk').default
    return app.initDataUnsafe?.user ?? null
  } catch {
    return null
  }
}

export const isAdmin = (): boolean => {
  const adminId = process.env.NEXT_PUBLIC_ADMIN_TG_ID
  const user = getTelegramUser()
  if (!user || !adminId) return false
  return String(user.id) === adminId
}

export const openLink = (url: string) => {
  if (typeof window === 'undefined') return
  try {
    const app = require('@twa-dev/sdk').default
    app.openLink(url)
  } catch {
    window.open(url, '_blank')
  }
}
