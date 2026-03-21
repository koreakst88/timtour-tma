'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type BookingSuccessProps = {
  tourTitle: string
}

export default function BookingSuccess({ tourTitle }: BookingSuccessProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // небольшой delay для анимации появления
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-6 text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      {/* Анимированная галочка */}
      <div
        className="mb-8 flex items-center justify-center"
        style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#FF6B35]">
          {/* Внешнее кольцо */}
          <div
            className="absolute inset-0 rounded-full bg-[#FF6B35]"
            style={{ animation: 'ripple 1.6s ease-out infinite' }}
          />
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'drawCheck 0.5s 0.25s ease forwards', opacity: 0 }}
          >
            <path
              d="M8 22L17.5 32L36 13"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Заголовок */}
      <h1 className="text-[28px] font-extrabold tracking-tight text-[#1F1F1B]">
        Заявка принята!
      </h1>

      {/* Подзаголовок */}
      <p className="mt-3 text-[15px] leading-7 text-[#66655E]">
        Менеджер свяжется с вами в ближайшее время
      </p>

      {/* Карточка тура */}
      <div className="mt-6 w-full max-w-sm rounded-2xl bg-white px-5 py-4 shadow-[0_14px_30px_rgba(32,26,23,0.07)] ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35]">
          Выбранный тур
        </p>
        <p className="mt-1.5 text-base font-bold text-[#1F1F1B]">{tourTitle}</p>
      </div>

      {/* Кнопки навигации */}
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Link
          href="/client"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF6B35] text-base font-bold text-white shadow-[0_12px_24px_rgba(255,107,53,0.25)]"
        >
          На главную
        </Link>
        <Link
          href="/bookings"
          className="flex h-14 w-full items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-base font-bold text-[#1F1F1B]"
        >
          Мои заявки
        </Link>
      </div>

      <style jsx>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.35; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes drawCheck {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
