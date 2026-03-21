import Link from 'next/link'
import AdminToursClient from '@/components/admin/AdminToursClient'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import type { Country, Tour } from '@/types'

type TourWithCountry = Tour & {
  country?: Country | null
}

export const dynamic = 'force-dynamic'

export default async function AdminToursPage() {
  await requireAdminAccess()

  const { data: tours } = await supabase
    .from('tours')
    .select('*, country:countries(*)')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <Link href="/admin" className="text-sm font-bold text-[#FF6B35]">
              ← Назад
            </Link>
            <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">Туры</h1>
          </div>

          <Link
            href="/admin/tours/new"
            className="rounded-[14px] bg-[#FF6B35] px-4 py-3 text-sm font-bold text-white"
          >
            + Добавить тур
          </Link>
        </header>

        <AdminToursClient tours={(tours ?? []) as TourWithCountry[]} />
      </div>
    </main>
  )
}
