'use client'

import { useEffect, useRef, useState } from 'react'
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton'
import { createBooking } from '@/app/actions/createBooking'
import { getTelegramUser } from '@/lib/telegram'
import type { Tour, TourDate } from '@/types'
import BookingSuccess from './BookingSuccess'

type Props = {
  tour: Tour & {
    dates?: TourDate[] | null
  }
}

type FormErrors = {
  userName?: string
  phone?: string
  travelDate?: string
}

const parsePrice = (priceStr: string): number => {
  const nums = priceStr.replace(/[^0-9]/g, '')
  return parseInt(nums) || 0
}

const formatPrice = (amount: number): string => {
  return '₩' + amount.toLocaleString('ko-KR')
}

const formatDateLabel = (d: TourDate) => {
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
  const fmt = (s: string) =>
    new Intl.DateTimeFormat('ru-RU', opts).format(new Date(s))
  const seatsLabel =
    d.seats_left > 0 ? `${d.seats_left} мест` : 'Нет мест'
  return { label: `${fmt(d.date_start)} — ${fmt(d.date_end)}`, seatsLabel }
}

export default function BookingForm({ tour }: Props) {
  useTelegramBackButton()
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [peopleCount, setPeopleCount] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null)

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  // pre-fill name from Telegram
  useEffect(() => {
    const user = getTelegramUser()
    if (user) {
      const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
      setUserName(name)
    }
  }, [])

  const isGroup =
    tour.type === 'group' && Array.isArray(tour.dates) && tour.dates.length > 0

  const sortedDates = isGroup
    ? [...(tour.dates as TourDate[])].sort(
        (a, b) =>
          new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
      )
    : []
  const basePrice = parsePrice(tour.price)
  const totalPrice = basePrice * peopleCount

  // When user picks a group date, derive travelDate from it
  const handleSelectDate = (d: TourDate) => {
    if (d.seats_left <= 0) return
    setSelectedDateId(d.id)
    setTravelDate(d.date_start)
  }

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (userName.trim().length < 2) e.userName = 'Минимум 2 символа'
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 7) e.phone = 'Минимум 7 цифр'
    if (!travelDate) e.travelDate = 'Выберите дату'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const user = getTelegramUser()
      const userTgId = user ? String(user.id) : 'browser_test'

      const id = await createBooking({
        tourId: tour.id,
        tourTitle: tour.title,
        userTgId,
        userName: userName.trim(),
        phone: phone.trim(),
        comment: comment.trim() || undefined,
        travelDate,
        peopleCount,
        totalPrice,
      })
      setBookingId(id)
    } catch (err) {
      console.error(err)
      setErrors({ userName: 'Ошибка при отправке. Попробуйте снова.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (bookingId) {
    return <BookingSuccess tourTitle={tour.title} />
  }

  return (
    <div className="pb-10 text-[#1F1F1B]">
      <div className="mx-auto w-full max-w-md">
        {/* Карточка тура */}
        <div className="mx-4 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_20px_rgba(32,26,23,0.06)] ring-1 ring-black/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35]">
            Выбранный тур
          </p>
          <p className="mt-1 text-[17px] font-extrabold leading-snug">
            {tour.title}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#66655E]">
            {tour.duration_days} дней ·{' '}
            {tour.type === 'group' ? 'Групповой' : 'Индивидуальный'}
          </p>
          <p className="mt-2 text-xl font-extrabold text-[#FF6B35]">
            {tour.price}
          </p>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 space-y-5 px-4"
        >
          {/* Имя */}
          <div>
            <label
              htmlFor="booking-name"
              className="mb-1.5 block text-sm font-bold text-[#1F1F1B]"
            >
              Ваше имя <span className="text-[#FF6B35]">*</span>
            </label>
            <input
              id="booking-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Иван Иванов"
              autoComplete="name"
              className={inputCls(!!errors.userName)}
            />
            {errors.userName && <FieldError>{errors.userName}</FieldError>}
          </div>

          {/* Телефон */}
          <div>
            <label
              htmlFor="booking-phone"
              className="mb-1.5 block text-sm font-bold text-[#1F1F1B]"
            >
              Телефон <span className="text-[#FF6B35]">*</span>
            </label>
            <input
              id="booking-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+82 10-0000-0000"
              autoComplete="tel"
              inputMode="tel"
              className={inputCls(!!errors.phone)}
            />
            {errors.phone && <FieldError>{errors.phone}</FieldError>}
          </div>

          {/* Количество человек */}
          <div>
            <label
              htmlFor="booking-people"
              className="mb-1.5 block text-sm font-bold text-[#1F1F1B]"
            >
              Количество человек
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeopleCount((c) => Math.max(1, c - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-xl font-bold text-[#1F1F1B] shadow-sm"
                aria-label="Уменьшить"
              >
                −
              </button>
              <input
                id="booking-people"
                type="number"
                value={peopleCount}
                min={1}
                max={20}
                onChange={(e) =>
                  setPeopleCount(
                    Math.min(20, Math.max(1, Number(e.target.value))),
                  )
                }
                className="h-11 w-16 rounded-xl border border-[#E5E7EB] bg-white text-center text-base font-bold text-[#1F1F1B] focus:border-[#FF6B35] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPeopleCount((c) => Math.min(20, c + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-xl font-bold text-[#1F1F1B] shadow-sm"
                aria-label="Увеличить"
              >
                +
              </button>
            </div>
            <div className="mt-2 rounded-2xl bg-[#FF6B35]/5 p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formatPrice(basePrice)} × {peopleCount} чел.
                </span>
                <span className="text-sm text-gray-500">
                  =
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Итого:
                </span>
                <span className="text-xl font-black text-[#FF6B35]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Дата */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-[#1F1F1B]">
              Дата <span className="text-[#FF6B35]">*</span>
            </label>

            {isGroup ? (
              <div className="space-y-2">
                {sortedDates.map((d) => {
                  const { label, seatsLabel } = formatDateLabel(d)
                  const isSelected = selectedDateId === d.id
                  const isFull = d.seats_left <= 0
                  return (
                    <button
                      key={d.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => handleSelectDate(d)}
                      className={[
                        'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all',
                        isSelected
                          ? 'border-[#FF6B35] bg-[#FFF4EF] text-[#FF6B35]'
                          : isFull
                            ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#9CA3AF]'
                            : 'border-[#E5E7EB] bg-white text-[#1F1F1B] hover:border-[#FF6B35]/60',
                      ].join(' ')}
                    >
                      <span>{label}</span>
                      <span
                        className={[
                          'rounded-full px-2.5 py-0.5 text-xs font-bold',
                          isSelected
                            ? 'bg-[#FF6B35] text-white'
                            : isFull
                              ? 'bg-[#E5E7EB] text-[#9CA3AF]'
                              : 'bg-[#F0FDF4] text-[#16A34A]',
                        ].join(' ')}
                      >
                        {seatsLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <input
                id="booking-date"
                type="date"
                value={travelDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTravelDate(e.target.value)}
                className={inputCls(!!errors.travelDate)}
              />
            )}

            {errors.travelDate && (
              <FieldError>{errors.travelDate}</FieldError>
            )}
          </div>

          {/* Комментарий */}
          <div>
            <label
              htmlFor="booking-comment"
              className="mb-1.5 block text-sm font-bold text-[#1F1F1B]"
            >
              Комментарий
            </label>
            <textarea
              id="booking-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ваши пожелания..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1F1F1B] placeholder:text-[#9CA3AF] focus:border-[#FF6B35] focus:outline-none"
            />
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF6B35] text-base font-bold text-white shadow-[0_12px_28px_rgba(255,107,53,0.3)] transition-opacity disabled:opacity-60"
          >
            {isLoading ? <Spinner /> : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── helpers ────────────────────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
  [
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1F1F1B]',
    'placeholder:text-[#9CA3AF] focus:outline-none transition-colors',
    hasError
      ? 'border-red-400 focus:border-red-500'
      : 'border-[#E5E7EB] focus:border-[#FF6B35]',
  ].join(' ')

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 text-xs font-semibold text-red-500">
      {children}
    </p>
  )
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Загрузка"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  )
}
