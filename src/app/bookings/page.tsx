'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Booking, Country, Tour, TourMedia } from '@/types'

type BookingWithTour = Booking & {
  tour?: (Tour & {
    country?: Country | null
    media?: TourMedia[] | null
  }) | null
}

const statusConfig = {
  new: {
    label: '🆕 Новая',
    color: '#FF6B35',
  },
  processing: {
    label: '🔄 В обработке',
    color: '#3B82F6',
  },
  confirmed: {
    label: '✅ Подтверждена',
    color: '#10B981',
  },
} as const

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithTour[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user
      const userTgId = tgUser?.id?.toString() ?? 'browser_test'

      const { data } = await supabase
        .from('bookings')
        .select('*, tour:tours(*, country:countries(*), media:tour_media(*))')
        .eq('user_tg_id', userTgId)
        .order('created_at', { ascending: false })

      setBookings((data ?? []) as BookingWithTour[])
      setIsLoading(false)
    }

    loadBookings()
  }, [])

  return (
    <main className="page-transition min-h-screen bg-[#FAFAF8] pb-24 text-[#1F1F1B]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pt-6">
        <header>
          <h1 className="text-[30px] font-extrabold tracking-[-0.03em]">Мои заявки</h1>
        </header>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20 text-sm font-medium text-[#6F6F68]">
            Загружаем заявки...
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
            <div className="text-5xl">📋</div>
            <p className="mt-5 text-lg font-bold text-[#1F1F1B]">У вас пока нет заявок</p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B35] px-6 text-sm font-bold text-white shadow-[0_14px_24px_rgba(255,107,53,0.25)]"
            >
              Смотреть туры
            </Link>
          </div>
        ) : (
          <section className="mt-5 space-y-4 pb-6">
            {bookings.map((booking) => {
              const tour = booking.tour
              const firstPhoto = [...(tour?.media ?? [])]
                .filter((item) => item.type === 'photo')
                .sort((left, right) => left.order - right.order)[0]
              const status = statusConfig[booking.status]

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-[20px] bg-white shadow-[0_16px_32px_rgba(28,23,18,0.08)]"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    {firstPhoto?.url ? (
                      <img
                        src={firstPhoto.url}
                        alt={tour?.title ?? 'Тур'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#FF6B35] to-[#F4A261]" />
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-extrabold leading-tight text-[#1F1F1B]">
                          {tour?.title ?? 'Тур'}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-[#6B6A64]">
                          {tour?.country?.flag_emoji ? `${tour.country.flag_emoji} ` : ''}
                          {tour?.country?.name ?? 'Направление'}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-bold" style={{ color: status.color }}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-[#5F5E58]">
                      <p>Дата поездки: {formatDate(booking.travel_date)}</p>
                      <p>Количество человек: {booking.people_count}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
