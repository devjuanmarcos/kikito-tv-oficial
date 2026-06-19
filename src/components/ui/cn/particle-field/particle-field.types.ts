import type React from 'react'

export interface ParticleFieldProps {
  count?: number
  color?: string
  speed?: number
  size?: number
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}
