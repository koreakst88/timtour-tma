'use client'

import { useState } from 'react'

type TourHighlightsProps = {
  highlights: string[]
}

export default function TourHighlights({ highlights }: TourHighlightsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (highlights.length === 0) return null

  return (
    <section className="mb-6 rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-extrabold text-[#1F1F1B]">Что вы увидите</span>
        <span
          className={`text-sm font-bold text-[#FF6B35] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-2">
          {highlights.slice(0, 6).map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-[16px] bg-[#FAFAF8] px-4 py-3 ring-1 ring-black/5"
            >
              <span className="mt-0.5 text-sm leading-none">📍</span>
              <p className="break-words text-sm font-medium leading-5 text-[#4F4E49]">{item}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
