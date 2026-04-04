import CatalogClient from '@/components/catalog/CatalogClient'
import { Tabbar } from '@/components/layout/Tabbar'
import { supabase } from '@/lib/supabase'
import type { Country, Tour } from '@/types'

type CatalogPageProps = {
  searchParams: Promise<{
    tab?: string
    country?: string
  }>
}

export const revalidate = 60

type TourWithRelations = Tour & {
  country?: Country | null
}

function isKoreaTour(tour: TourWithRelations) {
  const haystack = `${tour.title} ${tour.description ?? ''} ${tour.country?.name ?? ''}`.toLowerCase()
  return haystack.includes('сеул') || haystack.includes('пусан') || haystack.includes('коре')
}

function isEnglishCampTour(tour: TourWithRelations) {
  if (tour.tour_format === 'education') return true

  const haystack = `${tour.title} ${tour.description ?? ''}`.toLowerCase()
  return (
    tour.category === 'english_camp' ||
    haystack.includes('english camp') ||
    haystack.includes('learn & travel') ||
    haystack.includes('learn and travel')
  )
}

async function getAllTours() {
  const { data, error } = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load catalog tours', error)
  }

  return (data ?? []) as TourWithRelations[]
}

async function getCountries() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('order')

  if (error) {
    console.error('Failed to load countries', error)
  }

  return (data ?? []) as Country[]
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams

  const [allTours, countries] = await Promise.all([getAllTours(), getCountries()])

  const weekendTours = allTours.filter(isKoreaTour)

  const internationalTours = allTours.filter(
    (tour) => !isKoreaTour(tour) && tour.tour_format !== 'education' && !isEnglishCampTour(tour),
  )

  const englishCampTours = allTours.filter((tour) => tour.tour_format === 'education' || isEnglishCampTour(tour))

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-24 page-transition">
      <CatalogClient
        weekendTours={weekendTours}
        internationalTours={internationalTours}
        englishCampTours={englishCampTours}
        countries={countries}
        initialTab={resolvedSearchParams.tab ?? 'weekend'}
        initialCountry={resolvedSearchParams.country}
      />
      <Tabbar active="catalog" />
    </main>
  )
}
