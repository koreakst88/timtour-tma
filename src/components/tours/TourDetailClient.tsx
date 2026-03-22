'use client'

import Link from 'next/link'
import FavoriteButton from '@/components/tours/FavoriteButton'
import TourAccordion from '@/components/tours/TourAccordion'
import TourDates from '@/components/tours/TourDates'
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton'
import type { Country, Review, TourDate, TourMedia } from '@/types'

type Tour = {
  id: string
  title: string
  description: string
  price: string
  type: 'group' | 'individual'
  duration_days: number
  country?: Country | null
  media?: TourMedia[] | null
  dates?: TourDate[] | null
  reviews?: Review[] | null
}

type TourDetailClientProps = {
  tour: Tour
  photos: string[]
  dates: TourDate[]
  reviews: Review[]
  averageRating: string | null
}

const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export function TourDetailClient({
  tour,
  photos,
  dates,
  reviews,
  averageRating,
}: TourDetailClientProps) {
  useTelegramBackButton()

  const previewReviews = reviews.slice(0, 3)
  const coverPhoto = photos[0] ?? ''

  return (
    <div className="min-h-screen bg-white page-transition">

      {/* Индикатор свайпа — серая черточка сверху */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-gray-200 rounded-full" />
      </div>

      {/* ФОТО — полная ширина */}
      <div className="relative w-full h-[300px] overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
        )}
      </div>

      {/* БЕЛЫЙ БЛОК — скругление сверху, перекрывает низ фото */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-5 pt-5 pb-36">

        {/* Бейдж типа тура */}
        <div className="mb-3">
          <span className="bg-[#FF6B35]/10 text-[#FF6B35] px-3 py-1 rounded-full text-sm font-semibold">
            {tour.type === 'group'
              ? '👥 Групповой'
              : '🧳 Индивидуальный'}
          </span>
        </div>

        {/* Заголовок + избранное */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-black text-gray-900 flex-1 pr-3 leading-tight">
            {tour.title}
          </h1>
          <FavoriteButton tourId={tour.id} />
        </div>

        {/* Страна и длительность */}
        <p className="text-gray-500 mb-1">
          {tour.country?.flag_emoji
            ? `${tour.country.flag_emoji} `
            : ''}
          {tour.country?.name ?? 'Направление'}
        </p>
        <p className="text-gray-400 text-sm mb-4">
          📅 {tour.duration_days} дней
        </p>

        {/* Разделитель */}
        <div className="h-px bg-gray-100 mb-5" />

        {/* Описание */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2">
            О туре
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
            {tour.description}
          </p>
        </div>

        {/* Программа тура (только групповой) */}
        {tour.type === 'group' && (
          <div className="mb-5">
            <TourAccordion durationDays={tour.duration_days} />
          </div>
        )}

        {/* Даты (только групповой и если есть даты) */}
        {tour.type === 'group' && dates.length > 0 && (
          <div className="mb-5">
            <TourDates dates={dates} />
          </div>
        )}

        {/* Разделитель */}
        <div className="h-px bg-gray-100 mb-5" />

        {/* Отзывы */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-gray-900">
              Отзывы
            </h2>
            <span className="text-yellow-500 text-sm font-semibold">
              {averageRating
                ? `⭐ ${averageRating}`
                : '⭐ Нет оценок'}
            </span>
          </div>

          {previewReviews.length > 0 ? (
            <div className="space-y-3">
              {previewReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {review.user_name}
                      </p>
                      <p className="mt-0.5 text-[#FF6B35] text-xs">
                        {'★'.repeat(review.rating)}
                        <span className="text-gray-200">
                          {'★'.repeat(5 - review.rating)}
                        </span>
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatReviewDate(review.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {review.text}
                  </p>
                </article>
              ))}

              {reviews.length > 3 && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-[#FF6B35] px-4 py-3 text-sm font-bold text-[#FF6B35] active:scale-95 transition-transform"
                >
                  Показать все отзывы ({reviews.length})
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Будьте первым кто оставит отзыв ✍️
            </p>
          )}
        </div>
      </div>

      {/* НИЖНЯЯ ФИКСИРОВАННАЯ ПАНЕЛЬ — цена слева, кнопка справа */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 z-20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              Стоимость тура
            </p>
            <p className="text-2xl font-black text-[#FF6B35] leading-none">
              {tour.price}
            </p>
          </div>
          <Link href={`/booking/${tour.id}`}>
            <button
              type="button"
              className="bg-[#FF6B35] text-white px-8 py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform shadow-lg shadow-[#FF6B35]/30"
            >
              Забронировать ✈️
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
