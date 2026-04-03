'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useEffectEvent, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Clock3 } from 'lucide-react'
import FavoriteButton from '@/components/tours/FavoriteButton'
import type { Tour } from '@/types'

export default function TourCard({ tour }: { tour: Tour }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const images = [...(tour.media ?? [])]
    .filter((mediaItem) => mediaItem.type === 'photo' && Boolean(mediaItem.url))
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

  const getBadge = () => {
    if (tour.category === 'english_camp') {
      return {
        text: '🎒 English Camp',
        className: 'border-white/60 bg-white/88 text-[#7C3AED]',
      }
    }

    if (tour.type === 'group') {
      return {
        text: '👥 Групповой',
        className: 'border-white/60 bg-white/88 text-[#FF6B35]',
      }
    }

    return {
      text: '🧳 Индивидуальный',
      className: 'border-white/60 bg-white/82 text-[#5F6C86]',
    }
  }

  const badge = getBadge()
  const currentQuery = searchParams.toString()
  const returnTo = currentQuery ? `${pathname}?${currentQuery}` : pathname

  return (
    <Link
      href={{
        pathname: `/tour/${tour.id}`,
        query: { returnTo },
      }}
      prefetch={true}
      className="tap-effect relative mb-5 block w-full cursor-pointer overflow-hidden rounded-[24px] bg-white text-left shadow-[0_20px_40px_rgba(26,20,17,0.08)] ring-1 ring-black/5 transition active:scale-[0.99]"
    >
      <div className="relative h-[208px] overflow-hidden">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={`${tour.id}-${image}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={index !== activeImageIndex}
            >
              <Image
                src={image}
                alt={tour.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] via-[#FF8A5B] to-[#F4A261]" />
        )}

        <div
          className={`absolute left-4 top-4 inline-flex h-9 items-center rounded-full border px-3.5 text-xs font-bold shadow-[0_10px_24px_rgba(17,17,17,0.10)] backdrop-blur-md ${badge.className}`}
        >
          {badge.text}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton tourId={tour.id} />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="space-y-3.5 p-5">
        <h2 className="text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#1F1F1B]">
          {tour.title}
        </h2>

        <p className="text-sm font-semibold text-[#6B6A64]">
          {tour.country?.flag_emoji ? `${tour.country.flag_emoji} ` : ''}
          {tour.country?.name ?? 'Направление'}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A7972]">
            <Clock3 className="h-4 w-4 text-[#FF6B35]" />
            <span>{tour.duration_days} дней</span>
          </div>

          <div className="text-right text-[18px] font-extrabold text-[#FF6B35]">{tour.price}</div>
        </div>
      </div>
    </Link>
  )
}
