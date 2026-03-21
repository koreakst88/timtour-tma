import Link from 'next/link'
import { notFound } from 'next/navigation'
import FavoriteButton from '@/components/tours/FavoriteButton'
import TourAccordion from '@/components/tours/TourAccordion'
import TourDates from '@/components/tours/TourDates'
import TourGallery from '@/components/tours/TourGallery'
import { Tabbar } from '@/components/layout/Tabbar'
import { supabase } from '@/lib/supabase'
import type { Country, Review, Tour, TourDate, TourMedia } from '@/types'

type TourWithRelations = Tour & {
  country?: Country | null
  media?: TourMedia[] | null
  dates?: TourDate[] | null
  reviews?: Review[] | null
}

type TourPageProps = {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
  }).format(new Date(value))

const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export default async function TourPage({ params }: TourPageProps) {
  const { id } = await params

  const { data: tour } = await supabase
    .from('tours')
    .select(
      `
        *,
        country:countries(*),
        media:tour_media(*),
        dates:tour_dates(*),
        reviews:reviews(*)
      `
    )
    .eq('id', id)
    .single()

  if (!tour) notFound()

  const fullTour = tour as TourWithRelations
  const photos = [...(fullTour.media ?? [])]
    .filter((item) => item.type === 'photo')
    .sort((left, right) => left.order - right.order)
    .map((item) => item.url)
  const dates = [...(fullTour.dates ?? [])].sort(
    (left, right) =>
      new Date(left.date_start).getTime() - new Date(right.date_start).getTime()
  )
  const reviews = [...(fullTour.reviews ?? [])].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  )
  const previewReviews = reviews.slice(0, 3)
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null
  const typeLabel = fullTour.type === 'group' ? 'Групповой' : 'Индивидуальный'

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-48 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md">
        <section className="relative">
          <TourGallery images={photos} title={fullTour.title} />

          <Link
            href="/catalog"
            className="absolute left-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1F1F1B] shadow-[0_12px_24px_rgba(28,23,18,0.12)]"
            aria-label="Назад"
          >
            ←
          </Link>

          <div className="absolute right-4 top-4 z-10">
            <FavoriteButton tourId={fullTour.id} />
          </div>

          <div className="absolute bottom-4 left-4 z-10 inline-flex rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[#FF6B35] backdrop-blur-sm">
            {typeLabel}
          </div>
        </section>

        <div className="space-y-7 px-4 pt-5">
          <section>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em]">
              {fullTour.title}
            </h1>
            <p className="mt-2 text-base font-semibold text-[#66655E]">
              {fullTour.country?.flag_emoji ? `${fullTour.country.flag_emoji} ` : ''}
              {fullTour.country?.name ?? 'Направление'}
            </p>
            <p className="mt-3 text-sm font-medium text-[#66655E]">
              📅 {fullTour.duration_days} дней &nbsp;&nbsp; 👥 {typeLabel}
            </p>
            <p className="mt-4 text-[28px] font-extrabold text-[#FF6B35]">{fullTour.price}</p>
          </section>

          <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
            <h2 className="text-lg font-extrabold">О туре</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[#4F4E49]">
              {fullTour.description}
            </p>
          </section>

          {fullTour.type === 'group' ? (
            <>
              <TourAccordion durationDays={fullTour.duration_days} />
              <TourDates dates={dates} />
            </>
          ) : null}

          <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold">Отзывы</h2>
              <span className="text-sm font-bold text-[#FF6B35]">
                {averageRating ? `⭐ ${averageRating}` : '⭐ Нет оценок'}
              </span>
            </div>

            {previewReviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {previewReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-[18px] bg-[#FAFAF8] p-4 ring-1 ring-black/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#1F1F1B]">{review.user_name}</p>
                        <p className="mt-1 text-sm text-[#FF6B35]">
                          {'★'.repeat(review.rating)}
                          <span className="text-[#D1D5DB]">{'★'.repeat(5 - review.rating)}</span>
                        </p>
                      </div>
                      <span className="text-xs font-medium text-[#8A8982]">
                        {formatReviewDate(review.created_at)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#4F4E49]">{review.text}</p>
                  </article>
                ))}

                {reviews.length > 3 ? (
                  <button
                    type="button"
                    className="w-full rounded-[16px] border border-[#FF6B35] px-4 py-3 text-sm font-bold text-[#FF6B35]"
                  >
                    Показать все
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-sm font-medium text-[#6F6F68]">
                Будьте первым кто оставит отзыв
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
        <div className="mx-auto w-full max-w-md">
          <Link
            href={`/booking/${fullTour.id}`}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF6B35] text-base font-bold text-white shadow-[0_18px_30px_rgba(255,107,53,0.28)]"
          >
            Забронировать тур
          </Link>
        </div>
      </div>

      <Tabbar />
    </main>
  )
}
