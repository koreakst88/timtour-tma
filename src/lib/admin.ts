import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_TG_COOKIE } from '@/lib/admin-constants'

export async function getTelegramIdFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_TG_COOKIE)?.value ?? null
}

export async function isAdminRequest() {
  const adminId = process.env.NEXT_PUBLIC_ADMIN_TG_ID
  if (!adminId) return false

  const tgId = await getTelegramIdFromCookie()
  return tgId === adminId
}

export async function requireAdminAccess() {
  // if (!(await isAdminRequest())) {
  //   redirect('/client')
  // }
}
