import type React from 'react'

export type RevealAnimation = 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom'

export interface ScrollRevealProps {
  children: React.ReactNode
  animation?: RevealAnimation
  duration?: number
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
  style?: React.CSSProperties
}
