import type React from 'react'

export interface PricingToggleProps {
  value?: 'monthly' | 'yearly'
  defaultValue?: 'monthly' | 'yearly'
  onChange?: (period: 'monthly' | 'yearly') => void
  savingsLabel?: string
  className?: string
  style?: React.CSSProperties
}
