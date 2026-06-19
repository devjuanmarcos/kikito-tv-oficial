import type React from 'react'

export interface NewsletterFormProps {
  title?: string
  description?: string
  placeholder?: string
  ctaLabel?: string
  onSubmit?: (email: string) => void | Promise<void>
  variant?: 'card' | 'inline' | 'minimal'
  className?: string
  style?: React.CSSProperties
}
