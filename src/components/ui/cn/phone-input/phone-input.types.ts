import type React from 'react'

export interface CountryCode {
  code: string
  dial: string
  flag: string
  name: string
}

export interface PhoneInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  defaultCountry?: string
  className?: string
  style?: React.CSSProperties
}
