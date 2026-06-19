import type React from 'react'

export interface CreditCardProps {
  number?: string
  name?: string
  expiry?: string
  cvv?: string
  brand?: 'visa' | 'mastercard' | 'amex' | 'generic'
  variant?: 'dark' | 'light' | 'gradient'
  showBack?: boolean
  className?: string
  style?: React.CSSProperties
}
