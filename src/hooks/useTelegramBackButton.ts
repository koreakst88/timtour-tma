'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useTelegramBackButton(customBack?: () => void) {
  const router = useRouter()

  useEffect(() => {
    const tg = window?.Telegram?.WebApp
    if (!tg) return

    // Показываем встроенную кнопку назад
    tg.BackButton.show()

    const handleBack = () => {
      if (customBack) {
        customBack()
      } else {
        router.back()
      }
    }

    tg.BackButton.onClick(handleBack)

    return () => {
      // Скрываем кнопку когда уходим со страницы
      tg.BackButton.offClick(handleBack)
      tg.BackButton.hide()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
