'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton'
import TourCard from '@/components/tours/TourCard'
import { supabase } from '@/lib/supabase'
import type { Tour } from '@/types'

const STORAGE_KEY = 'timtour_favorites'

const readFavoriteIds = () => {
  if (typeof window === 'undefined') return []

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) return []

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export default function FavoritesPage() {
  useTelegramBackButton()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      const ids = readFavoriteIds()
      setFavoriteIds(ids)

      if (ids.length === 0) {
        setTours([])
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from('tours')
        .select('*, country:countries(*), media:tour_media(*)')
        .in('id', ids)

      const orderedTours = ids
        .map((id) => (data ?? []).find((tour) => tour.id === id))
        .filter(Boolean) as Tour[]

      setTours(orderedTours)
      setIsLoading(false)
    }

    loadFavorites()
  }, [])

  return (
    <main className="page-transition min-h-screen bg-[#FAFAF8] text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md pb-10">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm font-medium text-gray-500">
            Загружаем избранные туры...
          </div>
        ) : favoriteIds.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 px-4">
            <span className="text-6xl">❤️</span>
            <p className="font-medium text-gray-500">Нет избранных туров</p>
            <Link href="/catalog?tab=weekend">
              <button className="rounded-xl bg-[#FF6B35] px-6 py-3 font-bold text-white">
                Смотреть туры
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-5 px-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
