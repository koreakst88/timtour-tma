import { notFound } from 'next/navigation'
import { TourDetailClient } from '@/components/tours/TourDetailClient'
import { supabase } from '@/lib/supabase'
import type { Country, Review, Tour, TourDate, TourMedia, TourProgramDay } from '@/types'

type TourWithRelations = Tour & {
  country?: Country | null
  media?: TourMedia[] | null
  dates?: TourDate[] | null
  reviews?: Review[] | null
  program?: TourProgramDay[] | null
}

type TourPageProps = {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

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
        reviews:reviews(*),
        program:tour_program(*)
      `
    )
    .eq('id', id)
    .single()

  if (!tour) notFound()

  const fullTour = tour as TourWithRelations

  const dates = [...(fullTour.dates ?? [])].sort(
    (a, b) =>
      new Date(a.date_start).getTime() -
      new Date(b.date_start).getTime()
  )

  const reviews = [...(fullTour.reviews ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
      ).toFixed(1)
    : null

  return (
    <TourDetailClient
      tour={fullTour}
      dates={dates}
      reviews={reviews}
      averageRating={averageRating}
    />
  )
}
