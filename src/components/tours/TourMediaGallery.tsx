'use client'

import { useMemo, useState } from 'react'
import type { TourMedia } from '@/types'

type GalleryItem = {
  id: string
  url: string
  kind: 'photo' | 'video'
  isYoutube: boolean
}

type TourMediaGalleryProps = {
  title: string
  media?: TourMedia[] | null
}

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')
    const pathParts = parsed.pathname.split('/').filter(Boolean)

    if (hostname === 'youtu.be') {
      const videoId = pathParts[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (pathParts[0] === 'shorts' && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`
      }

      if (pathParts[0] === 'embed' && pathParts[1]) {
        return `https://www.youtube.com/embed/${pathParts[1]}`
      }
    }

    const videoId = parsed.searchParams.get('v')
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
  } catch {
    return url
  }

  return url
}

export default function TourMediaGallery({ title, media }: TourMediaGalleryProps) {
  const items = useMemo<GalleryItem[]>(() => {
    const sorted = [...(media ?? [])].sort((left, right) => left.order - right.order)
    const photos = sorted.filter((item) => item.type === 'photo')
    const videos = sorted.filter((item) => item.type === 'video')

    return [...photos, ...videos].map((item) => ({
      id: item.id,
      url: item.url,
      kind: item.type === 'video' ? 'video' : 'photo',
      isYoutube: isYoutubeUrl(item.url),
    }))
  }, [media])

  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const activeItem = items[activeIndex]

  const goTo = (index: number) => setActiveIndex(index)
  const goNext = () => setActiveIndex((current) => (current + 1) % items.length)
  const goPrev = () => setActiveIndex((current) => (current - 1 + items.length) % items.length)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX
    const delta = touchEndX - touchStartX

    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext()
      else goPrev()
    }

    setTouchStartX(null)
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="relative h-[320px] w-full bg-[#F2EDE7]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeItem ? (
          activeItem.kind === 'photo' ? (
            <img src={activeItem.url} alt={title} className="h-full w-full object-cover" />
          ) : activeItem.isYoutube ? (
            <iframe
              src={getYoutubeEmbedUrl(activeItem.url)}
              title={`${title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <video src={activeItem.url} controls className="h-full w-full object-cover" />
          )
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
        )}

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-[#1F1F1B] shadow-[0_10px_24px_rgba(17,17,17,0.14)]"
              aria-label="Предыдущее медиа"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-[#1F1F1B] shadow-[0_10px_24px_rgba(17,17,17,0.14)]"
              aria-label="Следующее медиа"
            >
              ›
            </button>
          </>
        ) : null}

        {activeItem?.kind === 'video' ? (
          <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white">
            ▶ Видео
          </span>
        ) : null}

        {items.length > 1 ? (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                className={[
                  'h-2.5 rounded-full transition-all',
                  index === activeIndex ? 'w-6 bg-white' : 'w-2.5 bg-white/55',
                ].join(' ')}
                aria-label={`Слайд ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
