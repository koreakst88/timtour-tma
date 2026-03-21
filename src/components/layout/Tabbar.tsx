'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, ClipboardList, User } from 'lucide-react'

type TabbarItem = 'home' | 'catalog' | 'favorites' | 'bookings' | 'profile'

type TabbarProps = {
  active?: TabbarItem
}

const items = [
  { href: '/client', label: 'Главная', icon: Compass, key: 'home' as const },
  { href: '/favorites', label: 'Избранное', icon: Heart, key: 'favorites' as const },
  { href: '/bookings', label: 'Заявки', icon: ClipboardList, key: 'bookings' as const },
  { href: '/profile', label: 'Профиль', icon: User, key: 'profile' as const },
]

export function Tabbar({ active }: TabbarProps) {
  const pathname = usePathname()
  const inferredActive: TabbarItem | undefined =
    active ??
    (pathname === '/favorites'
      ? 'favorites'
      : pathname === '/bookings'
        ? 'bookings'
        : pathname === '/profile'
          ? 'profile'
          : pathname === '/client' ||
              pathname.startsWith('/client/') ||
              pathname === '/catalog' ||
              pathname.startsWith('/tour/') ||
              pathname.startsWith('/booking/')
            ? 'home'
            : undefined)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#FF6B35] shadow-[0_-4px_20px_rgba(255,107,53,0.3)]">
      <div className="mx-auto flex h-full w-full max-w-md items-center justify-between px-3">
        {items.map(({ href, label, icon: Icon, key }) => {
          const isActive = inferredActive === key || pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-semibold transition ${
                isActive ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  isActive ? 'bg-white text-[#FF6B35]' : 'bg-transparent text-[rgba(255,255,255,0.6)]'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Tabbar
