import type React from 'react'

export interface AnimatedListProps {
  children: React.ReactNode[]
  staggerMs?: number
  animationMs?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  className?: string
  style?: React.CSSProperties
}
