'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import TourCard from '@/components/tours/TourCard'
import type { Country, Tour } from '@/types'

type CatalogTab = 'weekend' | 'international' | 'english_camp'

type CatalogClientProps = {
  weekendTours: Tour[]
  internationalTours: Tour[]
  englishCampTours: Tour[]
  countries: Country[]
  initialTab: string
  initialCountry?: string
}

const tabs: Array<{ id: CatalogTab; label: string }> = [
  { id: 'weekend', label: '🌸 Туры по Корее' },
  { id: 'international', label: '🌍 Зарубежные туры' },
  { id: 'english_camp', label: '🎓 Learn & Travel' },
]

function getInitialTab(value: string): CatalogTab {
  return tabs.some((tab) => tab.id === value) ? (value as CatalogTab) : 'weekend'
}

function isMalaysiaSpecialCountry(countryId: string | null) {
  return countryId === 'malaysia'
}

function matchesSpecialCountry(tour: Tour, countryId: string, countries: Country[]) {
  const selectedCountry = countries.find((country) => country.id === countryId)

  if (selectedCountry) {
    return tour.country_id === selectedCountry.id || tour.country?.name === selectedCountry.name
  }

  if (isMalaysiaSpecialCountry(countryId)) {
    const haystack = `${tour.title} ${tour.description ?? ''} ${tour.country?.name ?? ''}`.toLowerCase()
    return haystack.includes('малай') || haystack.includes('куала') || haystack.includes('лангкави') || haystack.includes('борнео')
  }

  return false
}

export default function CatalogClient({
  weekendTours,
  internationalTours,
  englishCampTours,
  countries,
  initialTab,
  initialCountry,
}: CatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<CatalogTab>(getInitialTab(initialTab))
  const [activeCountry, setActiveCountry] = useState<string | null>(
    getInitialTab(initialTab) === 'international' ? initialCountry ?? null : null,
  )
  const [searchQuery, setSearchQuery] = useState('')
  const cameFromHome = searchParams.get('from') === 'home'

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('tab', activeTab)
    if (activeTab === 'international' && activeCountry) {
      params.set('country', activeCountry)
    }
    if (cameFromHome) {
      params.set('from', 'home')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [activeTab, activeCountry, cameFromHome, pathname, router])

  useEffect(() => {
    const tg = window?.Telegram?.WebApp
    if (!tg) return

    if (cameFromHome) {
      tg.BackButton.show()
      const handleBack = () => router.push('/client')
      tg.BackButton.onClick(handleBack)
      return () => {
        tg.BackButton.offClick(handleBack)
        tg.BackButton.hide()
      }
    }

    tg.BackButton.hide()

    return () => {
      tg.BackButton.hide()
    }
  }, [cameFromHome, router])

  const internationalCountries = countries.filter((country) => country.name !== 'Корея')

  let activeTours: Tour[] = []

  if (activeTab === 'weekend') {
    activeTours = weekendTours
  } else if (activeTab === 'international') {
    activeTours = internationalTours
  } else {
    activeTours = englishCampTours
  }

  if (activeCountry) {
    activeTours = activeTours.filter((tour) =>
      matchesSpecialCountry(tour, activeCountry, countries),
    )
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (normalizedQuery) {
    activeTours = activeTours.filter((tour) =>
      tour.title.toLowerCase().includes(normalizedQuery),
    )
  }

  const emptyStateEmoji =
    activeTab === 'weekend' ? '🌸' : activeTab === 'international' ? '🌍' : '🎒'

  return (
    <div className="mx-auto w-full max-w-md overflow-x-hidden text-[#1F1F1B]">
      <div className="sticky top-0 z-20 bg-[#FAFAF8] pt-3 pb-2 shadow-[0_10px_24px_rgba(31,31,27,0.04)]">
        <h1 className="mb-3 px-4 text-xl font-black text-gray-900">Все направления</h1>

        <div className="mb-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id)
                  setActiveCountry(null)
                  setSearchQuery('')
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2 px-4">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <span className="text-gray-400">🔍</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск туров..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
        </div>

        {activeTab === 'international' && (
          <div className="overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              <button
                type="button"
                onClick={() => setActiveCountry(null)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  !activeCountry
                    ? 'bg-[#FF6B35] text-white'
                    : 'border border-[#FF6B35] bg-white text-[#FF6B35]'
                }`}
              >
                Все
              </button>

              {internationalCountries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => setActiveCountry(country.id)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    activeCountry === country.id
                      ? 'bg-[#FF6B35] text-white'
                      : 'border border-[#FF6B35] bg-white text-[#FF6B35]'
                  }`}
                >
                  {country.flag_emoji ? `${country.flag_emoji} ` : ''}
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-4 px-4 pb-8">
        {activeTours.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <span className="text-5xl">{emptyStateEmoji}</span>
            <p className="font-medium text-gray-400">Туры не найдены</p>
          </div>
        ) : (
          activeTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
        )}
      </div>
    </div>
  )
}
