'use client'

import { useState } from 'react'

type TourTextAccordionProps = {
  title: string
  content?: string | null
  items?: string[]
}

export default function TourTextAccordion({ title, content, items = [] }: TourTextAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const normalizedContent = content?.trim() ?? ''
  const normalizedItems = items.map((item) => item.trim()).filter(Boolean)

  if (!normalizedContent && normalizedItems.length === 0) return null

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-extrabold text-[#1F1F1B]">{title}</span>
        <span
          className={`text-sm font-bold text-[#FF6B35] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        <div className="mt-4 rounded-[18px] bg-[#FAFAF8] p-4 ring-1 ring-black/5">
          {normalizedItems.length > 0 ? (
            <div className="space-y-2">
              {normalizedItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm leading-none">•</span>
                  <p className="break-words text-sm leading-6 text-[#4F4E49]">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="whitespace-pre-line text-sm leading-6 text-[#4F4E49]">{normalizedContent}</p>
          )}
        </div>
      ) : null}
    </section>
  )
}
