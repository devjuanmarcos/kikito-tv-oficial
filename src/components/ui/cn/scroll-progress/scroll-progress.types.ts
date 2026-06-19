import type React from 'react'

export interface ScrollProgressProps {
  target?: 'page' | React.RefObject<HTMLElement>
  height?: number
  color?: string
  position?: 'top' | 'bottom'
  zIndex?: number
  className?: string
  style?: React.CSSProperties
}
