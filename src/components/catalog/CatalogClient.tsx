'use client'

import { Suspense, use, useState } from 'react'
import { Search } from 'lucide-react'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import TourCard from '@/components/tours/TourCard'
import type { Country, Tour } from '@/types'

type CatalogClientProps = {
  countries: Country[]
  toursPromise: Promise<Tour[]>
  initialCountry?: string
}

export default function CatalogClient({
  countries,
  toursPromise,
  initialCountry,
}: CatalogClientProps) {
  const [activeCountry, setActiveCountry] = useState<string | null>(initialCountry ?? null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-full max-w-full overflow-x-hidden text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md px-4 pt-2">
        <div className="sticky top-[4.25rem] z-20 -mx-4 bg-[#FAFAF8] px-4 pb-2 shadow-sm">
          <label className="relative mt-2 block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9B9B93]">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск туров..."
              className="h-14 w-full rounded-[20px] border border-white bg-white pl-12 pr-4 text-[15px] shadow-[0_14px_35px_rgba(32,26,23,0.07)] outline-none transition placeholder:text-[#B3B2AA] focus:border-[#FF6B35]/30 focus:ring-4 focus:ring-[#FF6B35]/10"
            />
          </label>

          <div className="mt-4 -mx-4 overflow-x-auto px-4">
            <div className="flex min-w-max gap-3 pb-1">
              <button
                type="button"
                onClick={() => setActiveCountry(null)}
                className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold transition ${
                  activeCountry === null
                    ? 'border-[#FF6B35] bg-[#FF6B35] text-white'
                    : 'border-[#FF6B35] bg-white text-[#FF6B35]'
                }`}
              >
                Все
              </button>

              {countries.map((country) => {
                const isActive = activeCountry === country.id

                return (
                  <button
                    key={country.id}
                    type="button"
                    onClick={() => setActiveCountry(country.id)}
                    className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-bold transition ${
                      isActive
                        ? 'border-[#FF6B35] bg-[#FF6B35] text-white'
                        : 'border-[#FF6B35] bg-white text-[#FF6B35]'
                    }`}
                  >
                    <span className="mr-2">{country.flag_emoji}</span>
                    <span>{country.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="w-full px-4 pb-6 pt-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          <ToursList
            toursPromise={toursPromise}
            activeCountry={activeCountry}
            searchQuery={searchQuery}
          />
        </Suspense>
      </div>
    </div>
  )
}

function ToursList({
  toursPromise,
  activeCountry,
  searchQuery,
}: {
  toursPromise: Promise<Tour[]>
  activeCountry: string | null
  searchQuery: string
}) {
  const tours = use(toursPromise)
  const normalizedSearch = searchQuery.trim().toLowerCase()

  const filteredTours = tours.filter((tour) => {
    const matchCountry = !activeCountry || tour.country_id === activeCountry
    const matchSearch =
      !normalizedSearch || tour.title.toLowerCase().includes(normalizedSearch)

    return matchCountry && matchSearch
  })

  return (
    <div className="w-full px-4 pb-6 pt-4">
      {filteredTours.length > 0 ? (
        filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
      ) : (
        <div className="rounded-[20px] bg-white px-5 py-10 text-center text-sm font-medium text-[#6F6F68] shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
          Туры не найдены 😔
        </div>
      )}
    </div>
  )
}
