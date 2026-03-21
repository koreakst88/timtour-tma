'use client'

import { useState } from 'react'
import type { TourDate } from '@/types'

type TourDatesProps = {
  dates: TourDate[]
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
  }).format(new Date(value))

export default function TourDates({ dates }: TourDatesProps) {
  const [activeDateId, setActiveDateId] = useState<string | null>(dates[0]?.id ?? null)

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <h2 className="text-lg font-extrabold">Даты тура</h2>

      {dates.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {dates.map((date) => {
            const isActive = activeDateId === date.id

            return (
              <button
                key={date.id}
                type="button"
                onClick={() => setActiveDateId(date.id)}
                className={`rounded-[18px] border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-[#FF6B35] bg-[#FF6B35] text-white'
                    : 'border-[#FF6B35]/20 bg-[#FAFAF8] text-[#1F1F1B]'
                }`}
              >
                <p className="text-sm font-bold">
                  {formatDate(date.date_start)} — {formatDate(date.date_end)}
                </p>
                <p className={`mt-1 text-xs font-medium ${isActive ? 'text-white/85' : 'text-[#6F6F68]'}`}>
                  Мест: {date.seats_left}/{date.seats_total}
                </p>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm font-medium text-[#6F6F68]">Уточните у менеджера</p>
      )}
    </section>
  )
}
