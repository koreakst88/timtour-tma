'use client'

import { useState } from 'react'
import type { TourDate } from '@/types'

type TourDatesProps = {
  dates: TourDate[]
  title?: string
  availabilityLabel?: string
  emptyTitle?: string
  emptyDescription?: string
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
  }).format(new Date(value))

export default function TourDates({
  dates,
  title = 'Даты тура',
  availabilityLabel = 'Мест',
  emptyTitle = 'Ближайший выезд уточняется',
  emptyDescription = 'Точные даты и наличие мест сообщит менеджер',
}: TourDatesProps) {
  const [activeDateId, setActiveDateId] = useState<string | null>(dates[0]?.id ?? null)

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_14px_30px_rgba(32,26,23,0.06)]">
      <h2 className="text-lg font-extrabold">{title}</h2>

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
                  {availabilityLabel}: {date.seats_left}/{date.seats_total}
                </p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-[18px] border border-dashed border-[#FF6B35]/20 bg-[#FAFAF8] px-4 py-4">
          <p className="text-sm font-bold text-[#1F1F1B]">{emptyTitle}</p>
          <p className="mt-1 text-sm leading-6 text-[#6F6F68]">
            {emptyDescription}
          </p>
        </div>
      )}
    </section>
  )
}
