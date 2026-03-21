import CatalogClient from '@/components/catalog/CatalogClient'
import { Tabbar } from '@/components/layout/Tabbar'
import { supabase } from '@/lib/supabase'
import type { Country, Tour } from '@/types'

type CatalogPageProps = {
  searchParams:
    | {
        country?: string
      }
    | Promise<{
        country?: string
      }>
}

export const dynamic = 'force-dynamic'

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams)

  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('order')

  const { data: tours, error: toursError } = await supabase
    .from('tours')
    .select(
      `
        *,
        country:countries(*),
        media:tour_media(*)
      `
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (countriesError) {
    console.error('Failed to load countries', countriesError)
  }

  if (toursError) {
    console.error('Failed to load tours', toursError)
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-24">
      <CatalogClient
        countries={(countries ?? []) as Country[]}
        tours={(tours ?? []) as Tour[]}
        initialCountry={resolvedSearchParams.country}
      />
      <Tabbar active="catalog" />
    </main>
  )
}
