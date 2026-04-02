import Link from 'next/link'
import { createTour } from '@/app/admin/actions'
import TourEditorForm from '@/components/admin/TourEditorForm'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminNewTourPage() {
  await requireAdminAccess()

  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('order')

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header>
          <Link href="/admin/tours" className="text-sm font-bold text-[#FF6B35]">
            ← Назад
          </Link>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">Новый тур</h1>
        </header>

        <TourEditorForm
          action={createTour}
          countries={countries ?? []}
          submitLabel="Создать тур"
        />
      </div>
    </main>
  )
}
