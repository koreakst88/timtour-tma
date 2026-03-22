import { Suspense } from 'react'
import { BackHeader } from '@/components/layout/BackHeader'
import CatalogClient from '@/components/catalog/CatalogClient'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
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

export const revalidate = 60

async function getTours() {
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

  if (toursError) {
    console.error('Failed to load tours', toursError)
  }

  return (tours ?? []) as Tour[]
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams)

  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('order')

  if (countriesError) {
    console.error('Failed to load countries', countriesError)
  }

  const toursPromise = getTours()

  return (
    <main className="page-transition min-h-screen bg-[#FAFAF8] pb-10">
      <div className="mx-auto w-full max-w-md">
        <BackHeader title="Все направления" />
      </div>
      <Suspense
        fallback={
          <div className="px-4 space-y-4 pt-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }
      >
        <CatalogClient
          countries={(countries ?? []) as Country[]}
          toursPromise={toursPromise}
          initialCountry={resolvedSearchParams.country}
        />
      </Suspense>
    </main>
  )
}
