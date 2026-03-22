'use client'

import { useRouter } from 'next/navigation'

interface BackHeaderProps {
  title?: string
}

export function BackHeader({ title }: BackHeaderProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-10 flex items-center bg-[#FAFAF8] px-4 py-3">
      <button
        type="button"
        onClick={() => router.back()}
        className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform active:scale-95"
        aria-label="Назад"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      {title ? <h1 className="text-lg font-bold text-gray-900">{title}</h1> : null}
    </div>
  )
}
