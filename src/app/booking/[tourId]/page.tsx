import { notFound } from 'next/navigation'
import BookingForm from '@/components/booking/BookingForm'
import { supabase } from '@/lib/supabase'
import type { Country, Tour, TourDate } from '@/types'

type BookingPageProps = {
  params: Promise<{ tourId: string }>
  searchParams?: Promise<{ comment?: string }>
}

export const dynamic = 'force-dynamic'

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { tourId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  const { data: tour } = await supabase
    .from('tours')
    .select('*, country:countries(*), dates:tour_dates(*)')
    .eq('id', tourId)
    .single<Tour & { country: Country | null; dates: TourDate[] | null }>()

  if (!tour) notFound()

  return (
    <main className="page-transition min-h-screen bg-[#FAFAF8] text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md">
        <BookingForm tour={tour} initialComment={resolvedSearchParams?.comment} />
      </div>
    </main>
  )
}
