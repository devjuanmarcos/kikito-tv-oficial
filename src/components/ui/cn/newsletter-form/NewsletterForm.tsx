'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { NewsletterFormProps } from './newsletter-form.types'

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

export function NewsletterForm({
  title = 'Stay in the loop',
  description = 'Get the latest updates delivered directly to your inbox.',
  placeholder = 'Enter your email address',
  ctaLabel = 'Subscribe',
  onSubmit,
  variant = 'card',
  className,
  style,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isEmail(email)) { setError('Please enter a valid email address.'); return }
    setError('')
    setLoading(true)
    await onSubmit?.(email)
    setLoading(false)
    setDone(true)
  }

  const isCard = variant === 'card'
  const isInline = variant === 'inline'

  if (done) {
    return (
      <div className={cn('flex items-center gap-3 text-[0.875rem] text-success font-medium', isCard && 'p-6 rounded-[--radius-lg] border border-rule bg-raised', className)} style={style}>
        <span className="text-xl">🎉</span>
        <span>You&apos;re subscribed! Check your inbox.</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        isCard && 'rounded-[--radius-lg] border border-rule bg-raised p-6 flex flex-col gap-3',
        isInline && 'flex flex-col gap-3',
        variant === 'minimal' && 'flex flex-col gap-2',
        className
      )}
      style={style}
    >
      {isCard && <div className="text-2xl">✉️</div>}
      {title && (
        <p className={cn('font-bold text-foreground', isCard ? 'text-[1.125rem]' : 'text-[1rem]')}>{title}</p>
      )}
      {description && (
        <p className="text-[0.875rem] text-muted">{description}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className={cn('flex gap-2', isInline ? 'flex-row' : 'flex-col sm:flex-row')}>
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            className="flex-1 px-3 py-2 rounded-[--radius-sm] border border-rule bg-canvas text-foreground text-[0.875rem] placeholder:text-faint outline-none focus:border-patina/60 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-[--radius-sm] bg-patina text-patina-fg text-[0.875rem] font-medium hover:bg-patina/90 transition-colors disabled:opacity-60 shrink-0"
          >
            {loading ? '…' : ctaLabel}
          </button>
        </div>
        {error && <p className="mt-2 text-[0.75rem] text-danger">{error}</p>}
      </form>

      {isCard && (
        <p className="text-[0.75rem] text-faint">We respect your privacy. Unsubscribe at any time.</p>
      )}
    </div>
  )
}
