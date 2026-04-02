'use client'

import { useState } from 'react'

type TourHighlightsProps = {
  highlights: string[]
}

export default function TourHighlights({ highlights }: TourHighlightsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (highlights.length === 0) return null

  const visibleHighlights = isExpanded ? highlights : highlights.slice(0, 4)
  const canExpand = highlights.length > 4

  return (
    <section className="mb-6 rounded-[24px] border border-black/5 bg-[#FFFDF9] p-5 shadow-[0_12px_28px_rgba(32,26,23,0.04)]">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#FFF1E8] px-2.5 py-1 text-xs font-bold text-[#FF6B35]">
          Что вы увидите
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {visibleHighlights.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-[16px] bg-[#FAFAF8] px-3.5 py-3 ring-1 ring-black/5"
          >
            <span className="mt-0.5 text-sm leading-none">📍</span>
            <p className="text-sm font-medium leading-5 break-words text-[#4F4E49]">{item}</p>
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
