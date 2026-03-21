'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/app/admin/actions'
import type { Booking, Country, Tour } from '@/types'

type BookingWithRelations = Booking & {
  tour?: (Tour & {
    country?: Pick<Country, 'name' | 'flag_emoji'> | null
  }) | null
}

type StatusFilter = 'all' | 'new' | 'processing' | 'confirmed'

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'processing', label: 'В обработке' },
  { value: 'confirmed', label: 'Подтверждены' },
]

const statusStyles = {
  new: { label: '🆕 Новая', className: 'text-[#FF6B35]' },
  processing: { label: '🔄 В обработке', className: 'text-[#3B82F6]' },
  confirmed: { label: '✅ Подтверждена', className: 'text-[#10B981]' },
} as const

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

export default function AdminBookingsClient({
  bookings,
}: {
  bookings: BookingWithRelations[]
}) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) =>
      activeFilter === 'all' ? true : booking.status === activeFilter
    )
  }, [activeFilter, bookings])

  const handleStatusChange = (bookingId: string, status: 'processing' | 'confirmed') => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-3">
          {statusOptions.map((option) => {
            const isActive = activeFilter === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'border-[#FF6B35] bg-[#FF6B35] text-white'
                    : 'border-[#FF6B35]/20 bg-white text-[#FF6B35]'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const status = statusStyles[booking.status]

          return (
            <article
              key={booking.id}
              className="rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_10px_24px_rgba(25,20,16,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-[#1F1F1B]">{booking.user_name}</h2>
                  <a href={`tel:${booking.phone}`} className="mt-1 block text-sm font-medium text-[#FF6B35]">
                    {booking.phone}
                  </a>
                </div>
                <span className={`text-xs font-bold ${status.className}`}>{status.label}</span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-[#4F4E49]">
                <p className="font-semibold">
                  {booking.tour?.title ?? 'Тур'}
                  {booking.tour?.country
                    ? ` · ${booking.tour.country.flag_emoji} ${booking.tour.country.name}`
                    : ''}
                </p>
                <p>Дата поездки: {formatDate(booking.travel_date)}</p>
                <p>Количество человек: {booking.people_count}</p>
                {booking.comment ? <p>Комментарий: {booking.comment}</p> : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(booking.id, 'processing')}
                  className="rounded-xl bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#3B82F6]"
                >
                  В обработке
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                  className="rounded-xl bg-[#ECFDF5] px-3 py-2 text-xs font-bold text-[#10B981]"
                >
                  Подтвердить
                </button>
                <a
                  href={`tg://user?id=${booking.user_tg_id}`}
                  className="rounded-xl bg-[#FFF7ED] px-3 py-2 text-xs font-bold text-[#FF6B35]"
                >
                  ✉️ Написать
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
