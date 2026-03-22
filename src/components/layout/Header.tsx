'use client'

import { useEffect, useState } from 'react'

export default function Header() {
  const [userName, setUserName] = useState<string>('')
  const [photoUrl, setPhotoUrl] = useState<string>('')

  useEffect(() => {
    let retryTimer: number | undefined

    const getTgUser = () => {
      const tg = window?.Telegram?.WebApp
      const user = tg?.initDataUnsafe?.user

      if (user?.first_name) {
        setUserName(user.first_name)
        if (user.photo_url) {
          setPhotoUrl(user.photo_url)
        }
        return true
      }

      return false
    }

    if (!getTgUser()) {
      retryTimer = window.setTimeout(() => {
        if (!getTgUser()) {
          retryTimer = window.setTimeout(getTgUser, 1000)
        }
      }, 300)
    }

    return () => {
      if (retryTimer) {
        clearTimeout(retryTimer)
      }
    }
  }, [])

  return (
    <header className="flex items-center justify-between bg-[#FAFAF8] px-4 pt-4 pb-3">
      <div className="flex w-16 shrink-0 items-center justify-start">
        <img
          src="/images/logo.png"
          alt="TimTour"
          className="h-16 w-16 rounded-full bg-[#FAFAF8] object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center px-2">
        <p className="whitespace-nowrap text-base font-black text-gray-900">
          Привет{userName ? `, ${userName}` : ''}! 👋
        </p>
        <p className="whitespace-nowrap text-xs font-medium text-gray-400">Куда летим?</p>
      </div>

      <div className="flex w-14 shrink-0 items-center justify-end">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex w-14 h-14 items-center justify-center rounded-full bg-[#FF6B35]/20 text-lg font-bold text-[#FF6B35]">
            {userName ? userName[0].toUpperCase() : '👤'}
          </div>
        )}
      </div>
    </header>
  )
}
