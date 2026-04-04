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

  const formatBadges = (() => {
    if (tour.has_individual) {
      return [
        {
          text: '👥 Групповой',
          className: 'border-[#FF6B35]/15 bg-[#FFF4EE] text-[#FF6B35]',
        },
        {
          text: '🧳 Индивидуальный',
          className: 'border-[#5F6C86]/12 bg-[#F4F6FA] text-[#5F6C86]',
        },
      ]
    }

    if (tour.type === 'individual') {
      return [
        {
          text: '🧳 Индивидуальный',
          className: 'border-[#5F6C86]/12 bg-[#F4F6FA] text-[#5F6C86]',
        },
      ]
    }

    return [
      {
        text: '👥 Групповой',
        className: 'border-[#FF6B35]/15 bg-[#FFF4EE] text-[#FF6B35]',
      },
    ]
  })()
  const activeTab = searchParams.get('tab') ?? 'international'
  const activeCountry = searchParams.get('country') ?? ''
  const isCatalog = pathname === '/catalog' || pathname.startsWith('/client/catalog')
  const isHome = pathname === '/client' || pathname.startsWith('/client/')
  const tourUrl = isCatalog
    ? `/tour/${tour.id}?${new URLSearchParams({
        from: 'catalog',
        tab: activeTab,
        ...(activeCountry ? { country: activeCountry } : {}),
      }).toString()}`
    : isHome
      ? `/tour/${tour.id}?${new URLSearchParams({ from: 'home' }).toString()}`
      : `/tour/${tour.id}`

  return (
    <Link
      href={tourUrl}
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

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton tourId={tour.id} />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="space-y-3.5 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex-1 text-[28px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#1F1F1B]">
            {tour.title}
          </h2>

          <div className="flex shrink-0 flex-col items-end gap-1.5 pt-1">
            {formatBadges.map((badge) => (
              <span
                key={badge.text}
                className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-[11px] font-bold leading-none shadow-[0_8px_18px_rgba(18,18,18,0.05)] ${badge.className}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>

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
