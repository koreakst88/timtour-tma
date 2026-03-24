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

function isMissingCategoryColumnError(error: { code?: string } | null) {
  return error?.code === '42703'
}

async function getWeekendTours() {
  const result = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('category', 'weekend')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!result.error) {
    return (result.data ?? []) as TourWithRelations[]
  }

  if (!isMissingCategoryColumnError(result.error)) {
    console.error('Failed to load weekend tours', result.error)
  }

  const fallback = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return ((fallback.data ?? []) as TourWithRelations[]).filter(
    (tour) => tour.country?.name === 'Корея',
  )
}

async function getInternationalTours() {
  const result = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('category', 'international')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!result.error) {
    return (result.data ?? []) as TourWithRelations[]
  }

  if (!isMissingCategoryColumnError(result.error)) {
    console.error('Failed to load international tours', result.error)
  }

  const fallback = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return ((fallback.data ?? []) as TourWithRelations[]).filter(
    (tour) => tour.country?.name && tour.country.name !== 'Корея',
  )
}

async function getEnglishCampTours() {
  const result = await supabase
    .from('tours')
    .select('*, country:countries(*), media:tour_media(*)')
    .eq('category', 'english_camp')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!result.error) {
    return (result.data ?? []) as TourWithRelations[]
  }

  if (!isMissingCategoryColumnError(result.error)) {
    console.error('Failed to load English Camp tours', result.error)
  }

  return [] as TourWithRelations[]
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

  const [weekendTours, internationalTours, englishCampTours, countries] = await Promise.all([
    getWeekendTours(),
    getInternationalTours(),
    getEnglishCampTours(),
    getCountries(),
  ])

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
