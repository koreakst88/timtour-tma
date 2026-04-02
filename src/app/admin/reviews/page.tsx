import Link from 'next/link'
import AdminReviewsClient from '@/components/admin/AdminReviewsClient'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import type { Review, Tour } from '@/types'

type ReviewWithTour = Review & {
  tour?: Pick<Tour, 'title'> | null
}

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  await requireAdminAccess()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, tour:tours(title)')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header>
          <Link href="/admin" className="text-sm font-bold text-[#FF6B35]">
            ← Назад
          </Link>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">Отзывы</h1>
        </header>

        <AdminReviewsClient reviews={(reviews ?? []) as ReviewWithTour[]} />
      </div>
    </main>
  )
}
