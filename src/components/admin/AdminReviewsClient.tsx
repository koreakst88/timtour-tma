'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateReviewVisibility } from '@/app/admin/actions'
import type { Review, Tour } from '@/types'

type ReviewWithTour = Review & {
  tour?: Pick<Tour, 'title'> | null
}

type Filter = 'all' | 'visible' | 'hidden'

const filterOptions: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'visible', label: 'Опубликованные' },
  { value: 'hidden', label: 'На модерации' },
]

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export default function AdminReviewsClient({ reviews }: { reviews: ReviewWithTour[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (activeFilter === 'visible') return review.is_visible
      if (activeFilter === 'hidden') return !review.is_visible
      return true
    })
  }, [activeFilter, reviews])

  const handleToggle = (reviewId: string, isVisible: boolean) => {
    startTransition(async () => {
      await updateReviewVisibility(reviewId, isVisible)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-3">
          {filterOptions.map((option) => {
            const isActive = option.value === activeFilter
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'border-[#FF6B35] bg-[#FF6B35] text-white'
                    : 'border-[#FF6B35]/20 bg-white text-[#FF6B35]'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-[#1F1F1B]">{review.user_name}</h2>
                <p className="mt-1 text-sm font-medium text-[#4F4E49]">
                  {review.tour?.title ?? 'Тур'}
                </p>
              </div>
              <span
                className={`text-xs font-bold ${review.is_visible ? 'text-[#10B981]' : 'text-[#FF6B35]'}`}
              >
                {review.is_visible ? '✅ Опубликован' : '🕓 На модерации'}
              </span>
            </div>

            <p className="mt-3 text-sm text-[#FF6B35]">
              {'★'.repeat(review.rating)}
              <span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-[#4F4E49]">{review.text}</p>
            <p className="mt-3 text-xs text-[#8A8982]">{formatDate(review.created_at)}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(review.id, true)}
                className="rounded-xl bg-[#ECFDF5] px-3 py-2 text-xs font-bold text-[#10B981]"
              >
                Опубликовать
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(review.id, false)}
                className="rounded-xl bg-[#FEF2F2] px-3 py-2 text-xs font-bold text-[#EF4444]"
              >
                Скрыть
              </button>
            </div>
          </article>
        ))}

        {filteredReviews.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-black/10 bg-[#FAFAFA] px-4 py-8 text-center text-sm text-[#6F6F68]">
            Отзывы не найдены
          </div>
        ) : null}
      </div>
    </div>
  )
}
