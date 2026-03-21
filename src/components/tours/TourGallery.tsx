'use client'

import { useState } from 'react'

type TourGalleryProps = {
  images: string[]
  title: string
}

export default function TourGallery({ images, title }: TourGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const showPrev = () => {
    if (images.length <= 1) return
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const showNext = () => {
    if (images.length <= 1) return
    setActiveIndex((current) => (current + 1) % images.length)
  }

  return (
    <div
      className="relative h-[280px] w-full overflow-hidden bg-[#FFE3D8]"
      onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStartX === null) return
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX
        const delta = touchStartX - touchEndX

        if (Math.abs(delta) > 40) {
          if (delta > 0) {
            showNext()
          } else {
            showPrev()
          }
        }

        setTouchStartX(null)
      }}
    >
      {images.length > 0 ? (
        images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden={index !== activeIndex}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

      {images.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? 'bg-white' : 'bg-white/45'
              }`}
            />
          ))}
        </div>
      ) : null}

      <span className="sr-only">{title}</span>
    </div>
  )
}
