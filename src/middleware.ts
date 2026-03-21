import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_TG_COOKIE } from '@/lib/admin-constants'

export function middleware(request: NextRequest) {
  const adminId = process.env.NEXT_PUBLIC_ADMIN_TG_ID
  const currentTgId = request.cookies.get(ADMIN_TG_COOKIE)?.value

  if (!adminId || currentTgId !== adminId) {
    return NextResponse.redirect(new URL('/client', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
