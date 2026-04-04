'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { deleteTour, toggleTourVisibility } from '@/app/admin/actions'
import type { Country, Tour } from '@/types'

type TourWithCountry = Tour & {
  country?: Country | null
}

const categoryBadgeConfig = {
  weekend: {
    label: '🌸 Корея',
    className: 'bg-emerald-50 text-emerald-700',
  },
  international: {
    label: '🌍 За рубеж',
    className: 'bg-sky-50 text-sky-700',
  },
  english_camp: {
    label: '🎒 Learn & Travel',
    className: 'bg-purple-50 text-purple-700',
  },
} as const

export default function AdminToursClient({ tours }: { tours: TourWithCountry[] }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = (tourId: string) => {
    startTransition(async () => {
      await toggleTourVisibility(tourId)
      router.refresh()
    })
  }

  const handleDelete = (tourId: string) => {
    if (!window.confirm('Удалить тур? Это действие нельзя отменить.')) return

    startTransition(async () => {
      await deleteTour(tourId)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <article
          key={tour.id}
          className="rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#1F1F1B]">{tour.title}</h2>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  categoryBadgeConfig[tour.category ?? 'international'].className
                }`}
              >
                {categoryBadgeConfig[tour.category ?? 'international'].label}
              </span>
              <p className="mt-1 text-sm text-[#6F6F68]">
                {tour.country?.flag_emoji ? `${tour.country.flag_emoji} ` : ''}
                {tour.country?.name ?? 'Направление'}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                tour.is_active ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F3F4F6] text-[#6B7280]'
              }`}
            >
              {tour.is_active ? 'Показывается' : 'Скрыт'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleToggle(tour.id)}
              className="rounded-xl bg-[#FFF7ED] px-3 py-2 text-xs font-bold text-[#FF6B35]"
            >
              {tour.is_active ? 'Скрыть' : 'Показать'}
            </button>
            <Link
              href={`/admin/tours/${tour.id}/edit`}
              className="rounded-xl bg-[#F3F4F6] px-3 py-2 text-xs font-bold text-[#1F1F1B]"
            >
              Редактировать
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDelete(tour.id)}
              className="rounded-xl bg-[#FEF2F2] px-3 py-2 text-xs font-bold text-[#EF4444]"
            >
              Удалить
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
