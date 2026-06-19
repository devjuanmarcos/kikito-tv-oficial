import type React from 'react'

export type ImageCompareDirection = 'horizontal' | 'vertical'

export interface ImageCompareProps {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  direction?: ImageCompareDirection
  initialPosition?: number
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}
