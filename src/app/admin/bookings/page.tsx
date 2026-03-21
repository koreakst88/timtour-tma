import Link from 'next/link'
import AdminBookingsClient from '@/components/admin/AdminBookingsClient'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import type { Booking, Country, Tour } from '@/types'

type BookingWithRelations = Booking & {
  tour?: (Tour & {
    country?: Pick<Country, 'name' | 'flag_emoji'> | null
  }) | null
}

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  await requireAdminAccess()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, tour:tours(title, country:countries(name, flag_emoji))')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header>
          <Link href="/admin" className="text-sm font-bold text-[#FF6B35]">
            ← Назад
          </Link>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">Заявки</h1>
        </header>

        <AdminBookingsClient bookings={(bookings ?? []) as BookingWithRelations[]} />
      </div>
    </main>
  )
}
