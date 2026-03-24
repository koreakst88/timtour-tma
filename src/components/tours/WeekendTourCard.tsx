'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Tour } from '@/types'

export default function WeekendTourCard({ tour }: { tour: Tour }) {
  const firstImage = [...(tour.media ?? [])]
    .filter((mediaItem) => mediaItem.type === 'photo' && Boolean(mediaItem.url))
    .sort((left, right) => left.order - right.order)[0]?.url

  return (
    <Link
      href={`/tour/${tour.id}`}
      className="w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-transform active:scale-95"
    >
      <div className="relative h-28">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={tour.title}
            fill
            className="object-cover"
            sizes="176px"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-2">
        <p className="mb-1 line-clamp-2 text-xs font-bold leading-tight text-gray-900">
          {tour.title}
        </p>
        <p className="text-xs font-black text-[#FF6B35]">
          {tour.price}
        </p>
      </div>
    </Link>
  )
}
