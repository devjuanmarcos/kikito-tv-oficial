import type React from 'react'

export interface VideoCardProps {
  src?: string
  poster?: string
  title?: string
  description?: string
  duration?: string
  category?: string
  views?: string | number
  href?: string
  className?: string
  style?: React.CSSProperties
}
