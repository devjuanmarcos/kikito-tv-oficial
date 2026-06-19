'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PricingToggleProps } from './pricing-toggle.types'

export function PricingToggle({
  value,
  onChange,
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  savingsLabel,
  className,
  style,
}: PricingToggleProps) {
  const [internal, setInternal] = useState<'monthly' | 'yearly'>('monthly')
  const current = value ?? internal

  function toggle(next: 'monthly' | 'yearly') {
    if (!value) setInternal(next)
    onChange?.(next)
  }

  return (
    <div className={cn('flex items-center gap-3', className)} style={style}>
      <span
        className={cn('text-[0.875rem] font-medium cursor-pointer transition-colors', current === 'monthly' ? 'text-foreground' : 'text-faint')}
        onClick={() => toggle('monthly')}
      >
        {monthlyLabel}
      </span>

      <button
        onClick={() => toggle(current === 'monthly' ? 'yearly' : 'monthly')}
        role="switch"
        aria-checked={current === 'yearly'}
        className="relative w-11 h-6 rounded-full bg-graphite transition-colors focus:outline-none"
        style={{ background: current === 'yearly' ? 'var(--ks-patina)' : undefined }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
          style={{ transform: current === 'yearly' ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>

      <span
        className={cn('text-[0.875rem] font-medium cursor-pointer transition-colors', current === 'yearly' ? 'text-foreground' : 'text-faint')}
        onClick={() => toggle('yearly')}
      >
        {yearlyLabel}
      </span>

      {savingsLabel && current === 'yearly' && (
        <span className="text-[0.75rem] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
          {savingsLabel}
        </span>
      )}
    </div>
  )
}
