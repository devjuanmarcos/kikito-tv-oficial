import type React from 'react'

export interface TiltCardProps {
  children: React.ReactNode
  maxTilt?: number
  scale?: number
  perspective?: number
  glare?: boolean
  className?: string
  style?: React.CSSProperties
}
