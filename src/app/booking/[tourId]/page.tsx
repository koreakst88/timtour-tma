import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BookingForm from '@/components/booking/BookingForm'
import type { Country, Tour, TourDate } from '@/types'

type BookingPageProps = {
  params: Promise<{ tourId: string }>
}

export const dynamic = 'force-dynamic'

export default async function BookingPage({ params }: BookingPageProps) {
  const { tourId } = await params

  const { data: tour } = await supabase
    .from('tours')
    .select('*, country:countries(*), dates:tour_dates(*)')
    .eq('id', tourId)
    .single<Tour & { country: Country | null; dates: TourDate[] | null }>()

  if (!tour) notFound()

  return <BookingForm tour={tour} />
}
