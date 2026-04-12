'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton'
import { getTelegramUser } from '@/lib/telegram'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" x2="100%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="50%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#instagram-gradient)" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="#fff" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path
        fill="#fff"
        d="M16.8 14.8c-.2.6-1.3 1.2-1.8 1.2s-1 .4-3.4-.6c-2.9-1.3-4.8-4.5-4.9-4.7-.1-.2-1.2-1.6-1.2-3.1 0-1.5.8-2.2 1.1-2.5.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.8.6.3.8 1 2.6 1.1 2.8.1.2.1.5 0 .7-.1.2-.2.5-.4.7-.2.2-.4.4-.5.6-.2.2-.3.4-.1.7.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1.2-.2.9-1 1.2-1.4.3-.4.5-.3.8-.2.3.1 2.1 1 2.4 1.2.3.2.6.3.6.5 0 .2 0 1.2-.2 1.8Z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.2 19v-5.9h2l.3-2.3h-2.3V9.3c0-.7.2-1.2 1.2-1.2h1.3V6.1c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.3v1.5H9v2.3h1.8V19h2.4Z"
      />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="#111" />
      <path
        fill="#25F4EE"
        d="M12.8 7.1v6.8a1.8 1.8 0 1 1-1.4-1.7V10a4.2 4.2 0 1 0 4.1 4.2V10.8c.7.5 1.6.8 2.5.8V9.2c-1.5 0-2.8-.9-3.3-2.1h-1.9Z"
      />
      <path
        fill="#FE2C55"
        d="M13.5 6v6.8a1.8 1.8 0 1 1-1.4-1.7v-1.2a3 3 0 0 0-.7-.1 4.2 4.2 0 1 0 4.2 4.2v-3c.7.5 1.6.8 2.4.8V9.4c-.5 0-1-.1-1.5-.3.4.5.9.9 1.5 1.1V8.1a3.7 3.7 0 0 1-2.4-.9A4 4 0 0 1 14.7 6h-1.2Z"
      />
      <path
        fill="#fff"
        d="M14.1 6.7c.4 1 .9 1.7 1.8 2.3.6.4 1.3.6 2 .7v1.3c-.9 0-1.8-.3-2.5-.8v3.6a3.6 3.6 0 1 1-3.6-3.6h.3v1.3a1.8 1.8 0 1 0 1.9 1.8V6.7h.1Z"
      />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#27A7E7" />
      <path
        fill="#fff"
        d="m17.7 7.4-1.8 9.1c-.1.6-.5.8-1 .5l-2.9-2.2-1.4 1.3c-.2.2-.3.3-.6.3l.2-3 5.5-5c.2-.2 0-.3-.3-.2l-6.8 4.3-2.9-.9c-.6-.2-.6-.6.1-.9l11.3-4.4c.5-.2.9.1.8 1.1Z"
      />
    </svg>
  )
}

const socialLinks = [
  { icon: InstagramIcon, label: 'Instagram', url: 'https://instagram.com/timtour22' },
  { icon: WhatsAppIcon, label: 'WhatsApp', url: 'https://wa.me/821084262206' },
  { icon: FacebookIcon, label: 'Facebook', url: 'https://www.facebook.com/timofeevna.timofeevna' },
  { icon: TikTokIcon, label: 'TikTok', url: 'https://tiktok.com/@timtour22' },
  { icon: TelegramIcon, label: 'Telegram', url: 'https://t.me/TimTour_WW' },
]

const openTelegramProfile = (url: string) => {
  const telegramApp = window.Telegram?.WebApp as
    | {
        openTelegramLink?: (link: string) => void
      }
    | undefined

  if (telegramApp?.openTelegramLink) {
    telegramApp.openTelegramLink(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

const openExternal = (url: string) => {
  const telegramApp = window.Telegram?.WebApp as
    | {
        openLink?: (
          link: string,
          options?: { try_browser?: string; try_instant_view?: boolean },
        ) => void
      }
    | undefined

  if (telegramApp?.openLink) {
    telegramApp.openLink(url, { try_browser: 'external' })
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export default function ProfilePage() {
  useTelegramBackButton()
  const user = getTelegramUser()

  const fullName = useMemo(() => {
    const parts = [user?.first_name, user?.last_name].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Гость TimTour'
  }, [user?.first_name, user?.last_name])

  const initials = useMemo(() => {
    if (user?.first_name) {
      return `${user.first_name[0]}${user.last_name?.[0] ?? ''}`.toUpperCase()
    }

    return 'TT'
  }, [user?.first_name, user?.last_name])

  return (
    <main className="page-transition min-h-screen bg-[#FAFAF8] pb-10 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md">
        <div className="px-4 pt-4">
          <section className="rounded-[24px] bg-white p-6 text-center shadow-[0_16px_32px_rgba(28,23,18,0.08)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#FFE7DD] text-2xl font-bold text-[#FF6B35]">
              {user?.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <h1 className="mt-4 text-[26px] font-extrabold tracking-[-0.03em]">{fullName}</h1>
            {user?.username ? (
              <p className="mt-1 text-sm font-medium text-[#6F6F68]">@{user.username}</p>
            ) : null}
          </section>

          <section className="mt-5 space-y-3">
            <Link
              href="/bookings"
              className="flex items-center justify-between rounded-[16px] bg-white px-4 py-4 text-sm font-bold shadow-[0_14px_28px_rgba(28,23,18,0.06)]"
            >
              <span>📋 Мои заявки</span>
              <span className="text-[#FF6B35]">→</span>
            </Link>

            <button
              type="button"
              onClick={() => openTelegramProfile('https://t.me/Timofeevna22')}
              className="flex w-full items-center justify-between rounded-[16px] bg-white px-4 py-4 text-sm font-bold shadow-[0_14px_28px_rgba(28,23,18,0.06)]"
            >
              <span>✉️ Написать менеджеру</span>
              <span className="text-[#FF6B35]">→</span>
            </button>
          </section>

          <section className="mt-7">
            <h2 className="text-lg font-extrabold">Мы в соцсетях</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 pb-6">
              {socialLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    item.label === 'Telegram'
                      ? openTelegramProfile(item.url)
                      : openExternal(item.url)
                  }
                  className="flex min-h-24 flex-col items-start justify-between rounded-[12px] bg-white px-4 py-4 text-left shadow-[0_14px_28px_rgba(28,23,18,0.06)]"
                >
                  <item.icon />
                  <span className="text-sm font-bold text-[#1F1F1B]">{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
