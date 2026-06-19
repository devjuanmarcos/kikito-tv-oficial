import type React from 'react'

export interface SwipeCardItem {
  id: string | number
  children: React.ReactNode
}

export interface SwipeCardProps {
  items: SwipeCardItem[]
  onSwipeLeft?: (id: string | number) => void
  onSwipeRight?: (id: string | number) => void
  threshold?: number
  className?: string
  style?: React.CSSProperties
}
