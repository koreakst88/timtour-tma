'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import FavoriteButton from '@/components/tours/FavoriteButton'
import TourAccordion from '@/components/tours/TourAccordion'
import TourDates from '@/components/tours/TourDates'
import TourHighlights from '@/components/tours/TourHighlights'
import TourMediaGallery from '@/components/tours/TourMediaGallery'
import TourModeSwitcher from '@/components/tours/TourModeSwitcher'
import TourReviewsSection from '@/components/tours/TourReviewsSection'
import TourTextAccordion from '@/components/tours/TourTextAccordion'
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton'
import type { Country, Review, Tour, TourDate, TourMedia, TourProgramDay } from '@/types'

type TourWithRelations = Tour & {
  country?: Country | null
  media?: TourMedia[] | null
  dates?: TourDate[] | null
  reviews?: Review[] | null
  program?: TourProgramDay[] | null
}

type TourDetailClientProps = {
  tour: TourWithRelations
  dates: TourDate[]
  reviews: Review[]
  averageRating: string | null
  canReview: boolean
}

type TourMode = 'group' | 'individual'

const INDIVIDUAL_FALLBACK =
  'Мы подберём маршрут под ваши даты, бюджет и формат отдыха.'

export function TourDetailClient({
  tour,
  dates,
  reviews,
  averageRating,
  canReview,
}: TourDetailClientProps) {
  useTelegramBackButton()

  const canSwitchMode = Boolean(tour.has_individual)
  const [mode, setMode] = useState<TourMode>(
    canSwitchMode ? 'group' : tour.type === 'individual' ? 'individual' : 'group',
  )

  const isIndividualMode = mode === 'individual'
  const highlights = Array.isArray(tour.highlights) ? tour.highlights.filter(Boolean) : []
  const includedItems = (tour.included ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const program = useMemo(
    () => [...(tour.program ?? [])].sort((left, right) => left.day_number - right.day_number),
    [tour.program],
  )
  const individualDescription = tour.individual_description?.trim() || INDIVIDUAL_FALLBACK
  const ctaHref = isIndividualMode
    ? `/booking/${tour.id}?comment=${encodeURIComponent('Интересует индивидуальный тур')}`
    : `/booking/${tour.id}`

  return (
    <div className="min-h-screen bg-white page-transition">
      <div className="flex justify-center pb-1 pt-3">
        <div className="h-1 w-10 rounded-full bg-gray-200" />
      </div>

      <TourMediaGallery title={tour.title} media={tour.media} />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-5 pb-36 pt-5">
        {canSwitchMode ? <TourModeSwitcher mode={mode} onChange={setMode} /> : null}

        {!canSwitchMode ? (
          <div className="mb-3">
            <span className="rounded-full bg-[#FF6B35]/10 px-3 py-1 text-sm font-semibold text-[#FF6B35]">
              {tour.type === 'group' ? '👥 Групповой' : '🧳 Индивидуальный'}
            </span>
          </div>
        ) : null}

        <div className="mb-2 flex items-start justify-between">
          <h1 className="flex-1 pr-3 text-2xl font-black leading-tight text-gray-900">{tour.title}</h1>
          <FavoriteButton tourId={tour.id} />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-[#6F6F68]">
          <span>
            {tour.country?.flag_emoji ? `${tour.country.flag_emoji} ` : ''}
            {tour.country?.name ?? 'Направление'}
          </span>
          <span>•</span>
          <span>📅 {tour.duration_days} дней</span>
        </div>

        <div className="mb-5 mt-5 h-px bg-gray-100" />

        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold text-gray-900">О туре</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{tour.description}</p>
        </section>

        <TourHighlights highlights={highlights} />

        <div className="transition-opacity duration-200">
          {isIndividualMode ? (
            <section className="mb-6 rounded-[24px] bg-[#FFF7ED] p-5 ring-1 ring-[#FF6B35]/10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF6B35]/70">
                Индивидуальный формат
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-[#1F1F1B]">
                Стоимость рассчитывается индивидуально
              </h2>
              {tour.individual_price_from ? (
                <p className="mt-2 text-sm font-bold text-[#FF6B35]">{tour.individual_price_from}</p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-[#4F4E49]">{individualDescription}</p>
            </section>
          ) : (
            <section className="mb-6 rounded-[24px] bg-[#FFF7ED] p-5 ring-1 ring-[#FF6B35]/10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF6B35]/70">
                Групповой формат
              </p>
              <h2 className="mt-2 text-3xl font-black leading-none text-[#FF6B35]">{tour.price}</h2>
              <p className="mt-2 text-sm text-[#6F6F68]">Фиксированная стоимость за одного человека.</p>
            </section>
          )}

          {!isIndividualMode && dates.length > 0 ? (
            <div className="mb-6">
              <TourDates dates={dates} />
            </div>
          ) : null}

          <div className="mb-6">
            <TourAccordion
              title={isIndividualMode ? 'Индивидуальная программа' : 'Программа тура'}
              program={isIndividualMode ? [] : program}
              content={isIndividualMode ? individualDescription : undefined}
              emptyText="Программа уточняется"
            />
          </div>
        </div>

        <div className="space-y-4">
          {includedItems.length > 0 ? (
            <TourTextAccordion title="Что входит в стоимость" items={includedItems} />
          ) : null}

        </div>

        <TourReviewsSection
          tourId={tour.id}
          tourTitle={tour.title}
          reviews={reviews}
          averageRating={averageRating}
          canReview={canReview}
        />

        <div className="space-y-4">
          {tour.booking_terms?.trim() ? (
            <TourTextAccordion title="Условия бронирования" content={tour.booking_terms} />
          ) : null}

          {tour.cancellation_terms?.trim() ? (
            <TourTextAccordion title="Условия отмены" content={tour.cancellation_terms} />
          ) : null}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <p className="mb-0.5 text-xs font-medium text-gray-400">
              {isIndividualMode ? 'Индивидуальный расчёт' : 'Стоимость тура'}
            </p>
            {isIndividualMode ? (
              <>
                <p className="text-sm font-bold leading-tight text-[#1F1F1B]">
                  Стоимость рассчитывается
                </p>
                {tour.individual_price_from ? (
                  <p className="mt-1 text-xs font-semibold text-[#FF6B35]">{tour.individual_price_from}</p>
                ) : null}
              </>
            ) : (
              <p className="text-lg font-bold leading-none text-[#1F1F1B]">{tour.price}</p>
            )}
          </div>

          <Link href={ctaHref}>
            <button
              type="button"
              className="rounded-2xl bg-[#FF6B35] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#FF6B35]/30 transition-transform active:scale-95 min-w-[190px]"
            >
              {isIndividualMode ? 'Узнать стоимость 💬' : 'Забронировать ✈️'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
