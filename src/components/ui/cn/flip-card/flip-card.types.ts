import type { ReactNode } from 'react'

export type FlipDirection = 'horizontal' | 'vertical'
export type FlipTrigger = 'hover' | 'click'

export interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  width?: number | string
  height?: number | string
  direction?: FlipDirection
  trigger?: FlipTrigger
  defaultFlipped?: boolean
  flipped?: boolean
  onFlip?: (flipped: boolean) => void
  className?: string
  style?: React.CSSProperties
}
