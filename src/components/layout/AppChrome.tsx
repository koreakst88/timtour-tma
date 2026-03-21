'use client'

import { usePathname } from 'next/navigation'
import { Tabbar } from '@/components/layout/Tabbar'

const shouldShowTabbar = (pathname: string) => {
  if (pathname.startsWith('/admin')) return false
  if (pathname.startsWith('/booking/')) return false

  return (
    pathname === '/client' ||
    pathname.startsWith('/client/') ||
    pathname === '/catalog' ||
    pathname.startsWith('/tour/') ||
    pathname === '/bookings' ||
    pathname === '/profile' ||
    pathname === '/favorites'
  )
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      {children}
      {shouldShowTabbar(pathname) ? <Tabbar /> : null}
    </>
  )
}
