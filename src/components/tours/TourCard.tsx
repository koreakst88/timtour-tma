'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock3 } from 'lucide-react'
import FavoriteButton from '@/components/tours/FavoriteButton'
import type { Tour } from '@/types'

export default function TourCard({ tour }: { tour: Tour }) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const images = [...(tour.media ?? [])]
    .filter((mediaItem) => mediaItem.type === 'photo')
    .sort((left, right) => left.order - right.order)
    .map((mediaItem) => mediaItem.url)

  const advanceSlide = useEffectEvent(() => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % images.length)
  })

  useEffect(() => {
    if (images.length <= 1) return

    const interval = window.setInterval(() => {
      advanceSlide()
    }, 3000)

    return () => window.clearInterval(interval)
  }, [images.length])
  const typeLabel = tour.type === 'group' ? 'Групповой' : 'Индивидуальный'

  return (
    <div
      onClick={() => router.push(`/tour/${tour.id}`)}
      className="relative mb-4 block w-full cursor-pointer overflow-hidden rounded-[20px] bg-white text-left shadow-[0_18px_36px_rgba(26,20,17,0.08)] transition active:scale-[0.99]"
    >
      <div className="relative h-[200px] overflow-hidden">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={`${tour.id}-${image}-${index}`}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                index === activeImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
              aria-hidden={index !== activeImageIndex}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] via-[#FF8A5B] to-[#F4A261]" />
        )}

        <div className="absolute left-4 top-4 inline-flex h-9 items-center rounded-full bg-white/92 px-3 text-xs font-bold text-[#FF6B35] backdrop-blur-sm">
          {typeLabel}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton tourId={tour.id} />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <h2 className="text-lg font-extrabold leading-tight text-[#1F1F1B]">{tour.title}</h2>

        <p className="text-sm font-semibold text-[#6B6A64]">
          {tour.country?.flag_emoji ? `${tour.country.flag_emoji} ` : ''}
          {tour.country?.name ?? 'Направление'}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A7972]">
            <Clock3 className="h-4 w-4 text-[#FF6B35]" />
            <span>{tour.duration_days} дней</span>
          </div>

          <div className="text-right text-lg font-extrabold text-[#FF6B35]">{tour.price}</div>
        </div>
      </div>
    </div>
  )
}
