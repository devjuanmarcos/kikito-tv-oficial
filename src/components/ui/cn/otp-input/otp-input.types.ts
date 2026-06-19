import type React from 'react'

export type OtpInputVariant = 'outline' | 'filled' | 'underline'
export type OtpInputSize = 'sm' | 'md' | 'lg'

export interface OtpInputProps {
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  variant?: OtpInputVariant
  size?: OtpInputSize
  disabled?: boolean
  invalid?: boolean
  mask?: boolean
  className?: string
  style?: React.CSSProperties
}
