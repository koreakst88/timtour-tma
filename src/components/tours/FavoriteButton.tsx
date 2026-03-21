'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

const STORAGE_KEY = 'timtour_favorites'

const readFavorites = (): string[] => {
  if (typeof window === 'undefined') return []

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) return []

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export default function FavoriteButton({ tourId }: { tourId: string }) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsFavorite(readFavorites().includes(tourId))
  }, [tourId])

  const toggleFavorite = () => {
    const favorites = readFavorites()
    const nextFavorites = favorites.includes(tourId)
      ? favorites.filter((id) => id !== tourId)
      : [...favorites, tourId]

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites))
    setIsFavorite(nextFavorites.includes(tourId))
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
      aria-pressed={isFavorite}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite()
      }}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[#FF6B35] shadow-[0_10px_24px_rgba(26,20,17,0.12)] backdrop-blur-sm transition active:scale-95"
    >
      <Heart
        className={`h-5 w-5 transition ${
          isFavorite ? 'fill-[#EF4444] text-[#EF4444]' : 'fill-transparent text-[#FF6B35]'
        }`}
      />
    </button>
  )
}
