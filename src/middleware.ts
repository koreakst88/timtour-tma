import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // TODO: вернуть защиту перед сдачей клиенту
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
