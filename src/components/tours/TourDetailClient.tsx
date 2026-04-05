'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import FavoriteButton from '@/components/tours/FavoriteButton'
import TourAccordion from '@/components/tours/TourAccordion'
import TourDates from '@/components/tours/TourDates'
import TourHighlights from '@/components/tours/TourHighlights'
import TourInfoListSection from '@/components/tours/TourInfoListSection'
import TourMediaGallery from '@/components/tours/TourMediaGallery'
import TourModeSwitcher from '@/components/tours/TourModeSwitcher'
import TourReviewsSection from '@/components/tours/TourReviewsSection'
import TourTextAccordion from '@/components/tours/TourTextAccordion'
import { useTelegramBackButton, useTourBackNavigation } from '@/hooks/useTelegramBackButton'
import { formatPricingOptionPrice, getDisplayTourPrice, getEducationPriceFrom, getEducationPricingOptions } from '@/lib/tour-pricing'
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

function normalizeOptionalList(value?: string[] | string | null) {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean)
  }

  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function TourDetailClient({
  tour,
  dates,
  reviews,
  averageRating,
  canReview,
}: TourDetailClientProps) {
  const searchParams = useSearchParams()
  const handleBack = useTourBackNavigation()
  useTelegramBackButton(handleBack)

  const canSwitchMode = Boolean(tour.has_individual)
  const requestedMode = searchParams.get('mode')
  const isEducationTour = tour.tour_format === 'education' || tour.category === 'english_camp'
  const [mode, setMode] = useState<TourMode>(
    canSwitchMode
      ? requestedMode === 'individual'
        ? 'individual'
        : 'group'
      : tour.type === 'individual'
        ? 'individual'
        : 'group',
  )

  const isIndividualMode = mode === 'individual'
  const highlights = Array.isArray(tour.highlights) ? tour.highlights.filter(Boolean) : []
  const ageRange = tour.age_range?.trim() ?? ''
  const parentBenefits = normalizeOptionalList(tour.parent_benefits ?? tour.program_benefits)
  const safetyItems = normalizeOptionalList(tour.safety_info ?? tour.support_info)
  const pricingOptions = getEducationPricingOptions(tour)
  const educationPriceFrom = getEducationPriceFrom(tour)
  const includedItems = (tour.included ?? '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const program = useMemo(
    () => [...(tour.program ?? [])].sort((left, right) => left.day_number - right.day_number),
    [tour.program],
  )
  const individualDescription = tour.individual_description?.trim() || INDIVIDUAL_FALLBACK
  const getCtaButton = () => {
    if (isEducationTour) {
      return {
        text: 'Оставить заявку',
        comment: 'Интересует программа Learn & Travel',
      }
    }

    if (isIndividualMode) {
      return {
        text: 'Подобрать тур ✈️',
        comment: 'Интересует индивидуальный тур',
      }
    }

    return {
      text: 'Забронировать сейчас 🔥',
      comment: '',
    }
  }

  const cta = getCtaButton()
  const bookingParams = new URLSearchParams({
    mode: isIndividualMode ? 'individual' : 'group',
  })
  const from = searchParams.get('from')
  const tab = searchParams.get('tab')
  const country = searchParams.get('country')

  if (from) bookingParams.set('from', from)
  if (tab) bookingParams.set('tab', tab)
  if (country) bookingParams.set('country', country)

  if (cta.comment) {
    bookingParams.set('comment', cta.comment)
  }

  const ctaHref = `/booking/${tour.id}?${bookingParams.toString()}`

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
              {isEducationTour
                ? '🎓 Образовательная программа'
                : tour.type === 'group'
                  ? '👥 Групповой'
                  : '🧳 Индивидуальный'}
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
          {!isIndividualMode ? (
            <>
              <span>•</span>
              <span>📅 {tour.duration_days} дней</span>
            </>
          ) : null}
          {isEducationTour && ageRange ? (
            <>
              <span>•</span>
              <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-bold text-[#FF6B35]">
                Возраст: {ageRange}
              </span>
            </>
          ) : null}
        </div>

        <div className="mb-5 mt-5 h-px bg-gray-100" />

        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold text-gray-900">
            {isEducationTour ? 'О программе' : 'О туре'}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{tour.description}</p>
        </section>

        <TourHighlights
          highlights={highlights}
          title={
            isEducationTour
              ? 'Что получит участник'
              : isIndividualMode
                ? 'Рекомендуемые места'
                : 'Что вы увидите'
          }
        />

        {isEducationTour ? (
          <div className="mb-6">
            <TourInfoListSection
              title="Почему эта программа"
              items={parentBenefits}
              emptyText={
                parentBenefits.length === 0
                  ? 'Преимущества программы для родителей скоро появятся здесь.'
                  : undefined
              }
              icon="✓"
            />
          </div>
        ) : null}

        {isEducationTour ? (
          <div className="mb-6">
            <TourInfoListSection
              title="Безопасность и сопровождение"
              items={safetyItems}
              emptyText={
                safetyItems.length === 0
                  ? 'Подробности о сопровождении и мерах безопасности скоро появятся здесь.'
                  : undefined
              }
              icon="🛡️"
            />
          </div>
        ) : null}

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
            <>
              {isEducationTour && pricingOptions.length > 0 ? (
                <section className="mb-6 rounded-[24px] bg-[#FFF7ED] p-5 ring-1 ring-[#FF6B35]/10">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF6B35]/70">
                    Образовательная программа
                  </p>
                  <h2 className="mt-2 text-2xl font-black leading-tight text-[#1F1F1B]">
                    Стоимость участия
                  </h2>
                  <p className="mt-2 text-sm text-[#6F6F68]">
                    Выберите подходящий вариант размещения. Для второго и третьего участника в одном
                    номере действует скидка 20%.
                  </p>

                  <div className="mt-4 space-y-3">
                    {pricingOptions.map((option) => (
                      <div
                        key={`${option.title}-${option.occupancy}-${option.label}`}
                        className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(31,31,27,0.06)] ring-1 ring-[#FF6B35]/10"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-[#1F1F1B]">{option.title}</p>
                            <p className="mt-1 text-sm font-medium text-[#6F6F68]">{option.occupancy}</p>
                            <p className="mt-2 inline-flex rounded-full bg-[#FFF7ED] px-2.5 py-1 text-xs font-bold text-[#FF6B35]">
                              {option.label}
                            </p>
                          </div>

                          <p className="text-lg font-black leading-none text-[#FF6B35]">
                            {formatPricingOptionPrice(option)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="mb-6 rounded-[24px] bg-[#FFF7ED] p-5 ring-1 ring-[#FF6B35]/10">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FF6B35]/70">
                    {isEducationTour ? 'Образовательная программа' : 'Групповой формат'}
                  </p>
                  <h2 className="mt-2 text-3xl font-black leading-none text-[#FF6B35]">
                    {getDisplayTourPrice(tour)}
                  </h2>
                  <p className="mt-2 text-sm text-[#6F6F68]">
                    {isEducationTour
                      ? 'Организованная программа для подростков с акцентом на развитие, среду и сопровождение.'
                      : 'Фиксированная стоимость за одного человека.'}
                  </p>
                </section>
              )}
            </>
          )}

          {!isIndividualMode ? (
            <div className="mb-6">
              <TourDates
                dates={dates}
                title={isEducationTour ? 'Даты программы' : 'Даты тура'}
                availabilityLabel={isEducationTour ? 'Участников' : 'Мест'}
                emptyTitle={isEducationTour ? 'Набор в программу уточняется' : 'Ближайший выезд уточняется'}
                emptyDescription={
                  isEducationTour
                    ? 'Точные даты участия и детали набора сообщит менеджер.'
                    : 'Точные даты и наличие мест сообщит менеджер'
                }
              />
            </div>
          ) : null}

          {!isIndividualMode ? (
            <div className="mb-6">
              <TourAccordion
                title={isEducationTour ? 'Программа поездки' : 'Программа тура'}
                program={program}
                emptyText="Программа уточняется"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          {!isIndividualMode && includedItems.length > 0 ? (
            <TourTextAccordion
              title={isEducationTour ? 'Что входит в программу' : 'Что входит в стоимость'}
              items={includedItems}
            />
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
              {isIndividualMode
                ? 'Индивидуальный расчёт'
                : isEducationTour
                  ? 'Стоимость программы'
                  : 'Стоимость тура'}
            </p>
            {isIndividualMode ? (
              <>
                {tour.individual_price_from ? (
                  <p className="text-lg font-bold leading-none text-[#1F1F1B]">{tour.individual_price_from}</p>
                ) : (
                  <p className="text-sm font-bold leading-tight text-[#1F1F1B]">По запросу</p>
                )}
              </>
            ) : (
              <p className="text-lg font-bold leading-none text-[#1F1F1B]">
                {isEducationTour && educationPriceFrom
                  ? `от ${formatPricingOptionPrice(educationPriceFrom)}`
                  : getDisplayTourPrice(tour)}
              </p>
            )}
          </div>

          <Link href={ctaHref}>
            <button
              type="button"
              className="rounded-2xl bg-[#FF6B35] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#FF6B35]/30 transition-transform active:scale-95 min-w-[190px]"
            >
              {cta.text}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
