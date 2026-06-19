import type React from 'react'

export type CarouselOrientation = 'horizontal' | 'vertical'

export interface CarouselItem {
  id: string
  content: React.ReactNode
}

export interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  loop?: boolean
  showDots?: boolean
  showArrows?: boolean
  orientation?: CarouselOrientation
  className?: string
  style?: React.CSSProperties
}
