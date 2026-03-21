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
      <img
        src="/images/logo.png"
        alt="TimTour"
        className="h-10 w-10 rounded-xl object-contain"
      />

      <div className="flex flex-col items-center">
        <p className="text-base font-black text-gray-900">
          Привет{userName ? `, ${userName}` : ''}! 👋
        </p>
        <p className="text-xs font-medium text-gray-400">Куда летим?</p>
      </div>

      {photoUrl ? (
        <img
          src={photoUrl}
          alt="avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B35]/20 font-bold text-[#FF6B35]">
          {userName ? userName[0].toUpperCase() : '👤'}
        </div>
      )}
    </header>
  )
}
