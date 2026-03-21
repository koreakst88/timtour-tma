'use client'

import { useMemo, useState } from 'react'

type TourAccordionProps = {
  durationDays: number
}

const dayDescriptions = [
  'Прилёт, размещение в отеле, знакомство с городом',
  'Обзорная экскурсия, посещение достопримечательностей',
  'Свободное время, шопинг',
]

export default function TourAccordion({ durationDays }: TourAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  const program = useMemo(() => {
    return Array.from({ length: durationDays }, (_, index) => ({
      day: index + 1,
      text: dayDescriptions[index] ?? 'Свободная программа, отдых и новые впечатления',
    }))
  }, [durationDays])

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg font-extrabold">Программа тура</span>
        <span
          className={`text-sm font-bold text-[#FF6B35] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-3">
          {program.map((item) => (
            <div key={item.day} className="rounded-[18px] bg-[#FAFAF8] p-4 ring-1 ring-black/5">
              <p className="font-bold text-[#1F1F1B]">День {item.day}</p>
              <p className="mt-2 text-sm leading-6 text-[#4F4E49]">{item.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
