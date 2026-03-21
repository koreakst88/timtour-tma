'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, ClipboardList, User } from 'lucide-react'

const items = [
  { href: '/client', label: 'Главная', icon: Compass },
  { href: '/favorites', label: 'Избранное', icon: Heart },
  { href: '/bookings', label: 'Заявки', icon: ClipboardList },
  { href: '/profile', label: 'Профиль', icon: User },
]

export default function Tabbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/96 shadow-[0_-10px_30px_rgba(27,22,18,0.08)] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                isActive ? 'text-[#FF6B35]' : 'text-[#98978F]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-[#FF6B35]' : 'text-[#98978F]'}`} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
