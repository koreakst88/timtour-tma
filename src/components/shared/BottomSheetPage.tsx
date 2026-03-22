'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BottomSheetPageProps {
  children: React.ReactNode
}

export function BottomSheetPage({ children }: BottomSheetPageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Небольшая задержка для плавного появления
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    // Рендерим placeholder вне экрана чтобы избежать layout shift
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          transform: 'translateY(100%)',
          zIndex: 50,
          background: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      />
    )
  }

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8,
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-white"
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
