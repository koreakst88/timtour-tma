import Link from 'next/link'
import { createTour } from '@/app/admin/actions'
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

        <form action={createTour} className="space-y-4 rounded-[20px] bg-[#FAFAFA] p-4">
          <input
            name="title"
            placeholder="Название тура"
            required
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          />

          <select
            name="country_id"
            required
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Выберите страну
            </option>
            {(countries ?? []).map((country) => (
              <option key={country.id} value={country.id}>
                {country.flag_emoji} {country.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Описание"
            required
            rows={5}
            className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
          />

          <input
            name="price"
            placeholder='$1,200'
            required
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          />

          <input
            name="duration_days"
            type="number"
            min="1"
            placeholder="Длительность"
            required
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          />

          <select
            name="type"
            defaultValue="group"
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          >
            <option value="group">Групповой</option>
            <option value="individual">Индивидуальный</option>
          </select>

          <select
            name="category"
            defaultValue="international"
            className="h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-sm outline-none"
          >
            <option value="international">International (Стандарт)</option>
            <option value="weekend">Weekend (Выходные)</option>
            <option value="english_camp">English Camp (Лагерь)</option>
          </select>

          <input
            name="photos"
            type="file"
            multiple
            accept="image/*"
            className="w-full rounded-[14px] border border-dashed border-[#FF6B35]/30 bg-white px-4 py-3 text-sm"
          />

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-[14px] bg-[#FF6B35] text-sm font-bold text-white"
          >
            Создать тур
          </button>
        </form>
      </div>
    </main>
  )
}
