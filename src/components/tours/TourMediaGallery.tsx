'use client'

import { useMemo, useState } from 'react'
import type { TourMedia } from '@/types'

type GalleryItem = {
  id: string
  url: string
  kind: 'photo' | 'video'
  isYoutube: boolean
  embedUrl?: string | null
  previewUrl?: string | null
}

type TourMediaGalleryProps = {
  title: string
  media?: TourMedia[] | null
}

function isYoutubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function getYoutubeVideoId(url: string) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')
    const pathParts = parsed.pathname.split('/').filter(Boolean)

    if (hostname === 'youtu.be') {
      return pathParts[0] ?? null
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (pathParts[0] === 'shorts' && pathParts[1]) {
        return pathParts[1]
      }

      if (pathParts[0] === 'embed' && pathParts[1]) {
        return pathParts[1]
      }
    }

    const videoId = parsed.searchParams.get('v')
    if (videoId) {
      return videoId
    }
  } catch {
    return null
  }

  return null
}

function getYoutubeEmbedUrl(url: string) {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : url
}

function getYoutubePreviewUrl(url: string) {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
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
      embedUrl: item.type === 'video' && isYoutubeUrl(item.url) ? getYoutubeEmbedUrl(item.url) : null,
      previewUrl: item.type === 'video' && isYoutubeUrl(item.url) ? getYoutubePreviewUrl(item.url) : null,
    }))
  }, [media])

  const [activeIndex, setActiveIndex] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const activeItem = items[activeIndex]

  const goTo = (index: number) => {
    setActiveIndex(index)
    setIsVideoModalOpen(false)
  }
  const goNext = () => {
    setActiveIndex((current) => (current + 1) % items.length)
    setIsVideoModalOpen(false)
  }
  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length)
    setIsVideoModalOpen(false)
  }

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
          ) : (
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="relative h-full w-full overflow-hidden bg-[#1C1C1A]"
              aria-label="Открыть видео"
            >
              {activeItem.isYoutube && activeItem.previewUrl ? (
                <img src={activeItem.previewUrl} alt={`${title} video preview`} className="h-full w-full object-cover" />
              ) : (
                <video
                  src={activeItem.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/35" />

              <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[#FF6B35] shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
                <span className="ml-1 text-3xl leading-none">▶</span>
              </div>

              <div className="absolute bottom-5 left-5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                Видео
              </div>
            </button>
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

      {isVideoModalOpen && activeItem?.kind === 'video' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-2xl text-white backdrop-blur-sm"
            aria-label="Закрыть видео"
          >
            ×
          </button>

          <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[9/16] w-full bg-black">
              {activeItem.isYoutube ? (
                <iframe
                  src={activeItem.embedUrl ?? getYoutubeEmbedUrl(activeItem.url)}
                  title={`${title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              ) : (
                <video
                  src={activeItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
