import type React from 'react'

export interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number
  radius?: number
  onClick?: () => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}
