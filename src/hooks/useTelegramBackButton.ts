'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
        router.push('/client')
      }
    }

    tg.BackButton.onClick(handleBack)

    return () => {
      // Скрываем кнопку когда уходим со страницы
      tg.BackButton.offClick(handleBack)
      tg.BackButton.hide()
    }
  }, [router, customBack])
}

export function useTourBackNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()

  return () => {
    const from = searchParams.get('from')
    const tab = searchParams.get('tab')
    const country = searchParams.get('country')

    if (from === 'catalog') {
      const params = new URLSearchParams()
      if (tab) params.set('tab', tab)
      if (country) params.set('country', country)
      const query = params.toString()
      router.push(query ? `/catalog?${query}` : '/catalog')
      return
    }

    router.push('/client')
  }
}
