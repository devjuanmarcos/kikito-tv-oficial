import type React from 'react'

export interface TypewriterProps {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
  loop?: boolean
  cursor?: boolean
  cursorChar?: string
  className?: string
  style?: React.CSSProperties
}
