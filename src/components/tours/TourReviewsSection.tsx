'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { submitReview } from '@/app/actions/reviews'
import { Button } from '@/components/ui/button'
import { getTelegramUser } from '@/lib/telegram'
import { supabase } from '@/lib/supabase'
import type { Review } from '@/types'

type TourReviewsSectionProps = {
  tourId: string
  tourTitle: string
  reviews: Review[]
  averageRating: string | null
  canReview: boolean
}

const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export default function TourReviewsSection({
  tourId,
  tourTitle,
  reviews,
  averageRating,
  canReview: initialCanReview,
}: TourReviewsSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [canReview, setCanReview] = useState(initialCanReview)
  const [isCheckingAccess, setIsCheckingAccess] = useState(!initialCanReview)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [isPending, startTransition] = useTransition()

  const visibleReviews = useMemo(
    () => (showAllReviews ? reviews : reviews.slice(0, 3)),
    [reviews, showAllReviews],
  )

  useEffect(() => {
    let isMounted = true

    const checkAccess = async () => {
      if (initialCanReview) {
        if (isMounted) {
          setCanReview(true)
          setIsCheckingAccess(false)
        }
        return
      }

      const user = getTelegramUser()
      const tgId = user?.id?.toString()

      if (!tgId) {
        if (isMounted) {
          setCanReview(false)
          setIsCheckingAccess(false)
        }
        return
      }

      const { data } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_tg_id', tgId)
        .eq('tour_id', tourId)
        .eq('status', 'confirmed')
        .limit(1)

      if (isMounted) {
        setCanReview((data ?? []).length > 0)
        setIsCheckingAccess(false)
      }
    }

    checkAccess()

    return () => {
      isMounted = false
    }
  }, [initialCanReview, tourId])

  const handleSubmit = () => {
    setError(null)
    setMessage(null)

    if (rating < 1 || rating > 5) {
      setError('Выберите оценку от 1 до 5')
      return
    }

    if (text.trim().length < 3) {
      setError('Добавьте текст отзыва')
      return
    }

    startTransition(async () => {
      const user = getTelegramUser()
      const result = await submitReview({
        tourId,
        tourTitle,
        userTgId: user?.id?.toString(),
        userName: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username,
        rating,
        text,
      })

      if (result.ok) {
        setMessage(result.message)
        setText('')
        setRating(0)
        setIsFormOpen(false)
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Отзывы</h2>
        <span className="text-sm font-semibold text-yellow-500">
          {averageRating ? `⭐ ${averageRating}` : '⭐ Нет оценок'}
        </span>
      </div>

      {visibleReviews.length > 0 ? (
        <div className="space-y-3">
          {visibleReviews.map((review) => (
            <article key={review.id} className="rounded-2xl bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{review.user_name}</p>
                  <p className="mt-0.5 text-xs text-[#FF6B35]">
                    {'★'.repeat(review.rating)}
                    <span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{formatReviewDate(review.created_at)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.text}</p>
            </article>
          ))}

          {reviews.length > 3 ? (
            <button
              type="button"
              onClick={() => setShowAllReviews((current) => !current)}
              className="w-full rounded-2xl border border-[#FF6B35] px-4 py-3 text-sm font-bold text-[#FF6B35] transition-transform active:scale-95"
            >
              {showAllReviews ? 'Свернуть отзывы' : `Показать все отзывы (${reviews.length})`}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-black/10 bg-[#FAFAF8] px-4 py-5 text-sm text-[#6F6F68]">
          Пока нет опубликованных отзывов
        </div>
      )}

      <div className="mt-4 rounded-[20px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]">
        {isCheckingAccess ? (
          <p className="text-sm text-[#6F6F68]">Проверяем возможность оставить отзыв...</p>
        ) : canReview ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#1F1F1B]">Оставить отзыв</h3>
                <p className="mt-1 text-sm text-[#6F6F68]">
                  Ваш отзыв появится после модерации.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-[#FF6B35]/20 bg-[#FFF7ED] px-4 text-[#FF6B35]"
                onClick={() => setIsFormOpen((current) => !current)}
              >
                {isFormOpen ? 'Скрыть' : 'Оставить отзыв'}
              </Button>
            </div>

            {isFormOpen ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-bold text-[#1F1F1B]">Оценка</p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1
                      const isActive = value <= rating

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={`text-2xl transition-transform ${isActive ? 'text-[#FFB020]' : 'text-[#D7D6D0]'}`}
                          aria-label={`Оценка ${value}`}
                        >
                          ★
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold text-[#1F1F1B]">Текст отзыва</p>
                  <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={4}
                    placeholder="Поделитесь впечатлениями о туре"
                    className="w-full rounded-[14px] border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm outline-none"
                  />
                </div>

                {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
                {message ? <p className="text-sm font-medium text-[#10B981]">{message}</p> : null}

                <Button
                  type="button"
                  disabled={isPending}
                  className="h-11 rounded-[14px] bg-[#FF6B35] px-5 text-white"
                  onClick={handleSubmit}
                >
                  {isPending ? 'Отправляем...' : 'Отправить'}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-[#6F6F68]">
            Отзыв можно оставить только после подтверждённого бронирования
          </p>
        )}
      </div>
    </section>
  )
}
