'use client'

import { useEffect, useState } from 'react'

type TourCardSliderProps = {
  images: string[]
  title: string
  className?: string
}

export default function TourCardSlider({
  images,
  title,
  className = '',
}: TourCardSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = images.length > 0

  useEffect(() => {
    if (images.length <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [images.length])

  if (!hasImages) {
    return (
      <div
        className={`overflow-hidden bg-gradient-to-br from-[#FF6B35] via-[#FF8A5B] to-[#F4A261] ${className}`}
        aria-label={`${title}: изображение отсутствует`}
      />
    )
  }

  return (
    <div className={`relative overflow-hidden bg-[#FFE6DC] ${className}`} aria-label={title}>
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden={index !== activeIndex}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}
