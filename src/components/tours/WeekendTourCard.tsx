'use client'

import Image from 'next/image'
import Link from 'next/link'
import { isMiniGroupTour } from '@/lib/tour-badges'
import { getDisplayTourPrice } from '@/lib/tour-pricing'
import type { Tour } from '@/types'

export default function WeekendTourCard({ tour }: { tour: Tour }) {
  const firstImage = [...(tour.media ?? [])]
    .filter((mediaItem) => mediaItem.type === 'photo' && Boolean(mediaItem.url))
    .sort((left, right) => left.order - right.order)[0]?.url
  const showMiniGroupBadge = isMiniGroupTour(tour)
  const tourUrl = `/tour/${tour.id}?${new URLSearchParams({ from: 'home' }).toString()}`

  return (
    <Link
      href={tourUrl}
      className="w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-transform active:scale-95"
    >
      <div className="relative h-28">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={tour.title}
            fill
            unoptimized={true}
            className="object-cover"
            sizes="176px"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-2">
        {showMiniGroupBadge ? (
          <span className="mb-1 inline-flex rounded-full border border-[#D8D2C8] bg-[#F6F3EE] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#7B746B]">
            Мини-группа
          </span>
        ) : null}

        <p className="mb-1 line-clamp-2 text-xs font-bold leading-tight text-gray-900">
          {tour.title}
        </p>
        <p className="text-xs font-black text-[#FF6B35]">
          {getDisplayTourPrice(tour)}
        </p>
      </div>
    </Link>
  )
}
