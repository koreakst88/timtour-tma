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

  const weekendTours = allTours.filter((tour) => {
    if (tour.category) return tour.category === 'weekend'

    const countryName = tour.country?.name ?? ''
    return countryName === 'Корея'
  })

  const internationalTours = allTours.filter((tour) => {
    if (tour.category) return tour.category === 'international'

    const countryName = tour.country?.name ?? ''
    return countryName !== 'Корея' && !tour.title.toLowerCase().includes('english camp')
  })

  const englishCampTours = allTours.filter((tour) => {
    if (tour.category) return tour.category === 'english_camp'

    return tour.title.toLowerCase().includes('english camp')
  })

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
