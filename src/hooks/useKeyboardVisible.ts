'use client'
import { useEffect, useState } from 'react'

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    // We only want to track this on the client
    if (typeof window === 'undefined') return

    const initialHeight = window.innerHeight

    const handleResize = () => {
      const currentHeight = window.innerHeight
      // Если высота уменьшилась больше чем на 150px
      // значит клавиатура открылась
      const keyboardOpen = initialHeight - currentHeight > 150
      setIsKeyboardVisible(keyboardOpen)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isKeyboardVisible
}
