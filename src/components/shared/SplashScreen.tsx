'use client'

import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAFAF8]"
      style={{
        animation: visible
          ? 'none'
          : 'fadeOut 0.3s ease forwards',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src="/images/logo.png"
          alt="TimTour"
          className="h-32 w-32 object-contain animate-pulse"
        />
        <p className="text-lg font-bold tracking-wide text-[#FF6B35]">
          TimTour
        </p>
        <p className="text-sm text-gray-400">
          Travel agency
        </p>
      </div>
    </div>
  )
}
