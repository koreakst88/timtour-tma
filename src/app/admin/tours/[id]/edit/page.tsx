import Link from 'next/link'
import { notFound } from 'next/navigation'
import { updateTour } from '@/app/admin/actions'
import TourEditorForm from '@/components/admin/TourEditorForm'
import { requireAdminAccess } from '@/lib/admin'
import { supabase } from '@/lib/supabase'

type EditTourPageProps = {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function AdminEditTourPage({ params }: EditTourPageProps) {
  await requireAdminAccess()
  const { id } = await params

  const [{ data: tour }, { data: countries }, { data: program }] = await Promise.all([
    supabase.from('tours').select('*').eq('id', id).single(),
    supabase.from('countries').select('*').eq('is_active', true).order('order'),
    supabase.from('tour_program').select('*').eq('tour_id', id).order('day_number'),
  ])

  if (!tour) notFound()

  const updateTourAction = updateTour.bind(null, id)

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md space-y-5">
        <header>
          <Link href="/admin/tours" className="text-sm font-bold text-[#FF6B35]">
            ← Назад
          </Link>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">Редактировать тур</h1>
        </header>
        <TourEditorForm
          action={updateTourAction}
          countries={countries ?? []}
          initialTour={tour}
          initialProgram={program ?? []}
          submitLabel="Сохранить изменения"
        />
      </div>
    </main>
  )
}
