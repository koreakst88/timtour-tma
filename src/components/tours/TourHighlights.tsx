'use client'

import { useState } from 'react'

type TourHighlightsProps = {
  highlights: string[]
}

export default function TourHighlights({ highlights }: TourHighlightsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (highlights.length === 0) return null

  const visibleHighlights = isExpanded ? highlights : highlights.slice(0, 6)
  const canExpand = highlights.length > 6

  return (
    <section className="mb-6 rounded-[24px] bg-[#FAFAF8] p-5 ring-1 ring-black/5">
      <h2 className="text-lg font-extrabold text-[#1F1F1B]">Что вы увидите</h2>

      <div className="mt-4 space-y-2.5">
        {visibleHighlights.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-[18px] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(32,26,23,0.04)]"
          >
            <span className="text-base leading-none">📍</span>
            <p className="text-sm font-medium leading-6 text-[#4F4E49]">{item}</p>
          </div>
        ))}
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="mt-4 text-sm font-bold text-[#FF6B35]"
        >
          {isExpanded ? 'Скрыть' : 'Показать все'}
        </button>
      ) : null}
    </section>
  )
}
