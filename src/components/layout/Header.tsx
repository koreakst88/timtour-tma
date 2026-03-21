'use client'

import Image from 'next/image'
import { getTelegramUser } from '@/lib/telegram'

export default function Header() {
  const user = getTelegramUser()

  const greeting = user?.first_name ? `Привет, ${user.first_name}! 👋` : 'Привет! 👋'

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <Image src="/images/logo.png" alt="TimTour" width={132} height={36} className="h-9 w-auto" />
        <p className="mt-4 text-[22px] font-extrabold tracking-[-0.02em] text-[#1F1F1B]">
          {greeting}
        </p>
        <p className="mt-1 text-[15px] font-medium text-[#7D7C74]">Куда летим?</p>
      </div>

      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(26,20,17,0.08)]">
        {user?.photo_url ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${user.photo_url})` }}
            role="img"
            aria-label={user.first_name ?? 'Пользователь'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#FFE7DD] text-sm font-bold text-[#FF6B35]">
            {user?.first_name?.slice(0, 1) ?? 'TT'}
          </div>
        )}
      </div>
    </header>
  )
}
