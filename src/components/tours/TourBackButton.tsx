'use client'

import { useRouter } from 'next/navigation'

export default function TourBackButton() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="absolute left-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1F1F1B] shadow-[0_12px_24px_rgba(28,23,18,0.12)]"
      aria-label="Назад"
    >
      ←
    </button>
  )
}
