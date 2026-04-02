'use client'

import { useState } from 'react'
import type { TourProgramDay } from '@/types'

type TourAccordionProps = {
  title?: string
  durationDays?: number
  program?: TourProgramDay[]
  emptyText?: string
  content?: string
}

export default function TourAccordion({
  title = 'Программа тура',
  program = [],
  emptyText = 'Программа уточняется',
  content,
}: TourAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-extrabold text-[#1F1F1B]">{title}</span>
        <span
          className={`text-sm font-bold text-[#FF6B35] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        content ? (
          <div className="mt-4 rounded-[18px] bg-[#FAFAF8] p-4 ring-1 ring-black/5">
            <p className="whitespace-pre-line text-sm leading-6 text-[#4F4E49]">{content}</p>
          </div>
        ) : program.length > 0 ? (
          <div className="mt-4 space-y-3">
            {program
              .slice()
              .sort((left, right) => left.day_number - right.day_number)
              .map((item) => (
                <div key={item.id} className="rounded-[18px] bg-[#FAFAF8] p-4 ring-1 ring-black/5">
                  <p className="font-bold text-[#1F1F1B]">День {item.day_number}</p>
                  <p className="mt-2 text-sm font-semibold text-[#1F1F1B]">{item.title}</p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-6 text-[#4F4E49]">{item.description}</p>
                  ) : null}
                </div>
              ))}
          </div>
        ) : (
          <p className="mt-4 text-sm font-medium text-[#6F6F68]">{emptyText}</p>
        )
      ) : null}
    </section>
  )
}
