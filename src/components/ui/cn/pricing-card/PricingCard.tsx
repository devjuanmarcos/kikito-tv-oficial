'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export interface PricingFeature {
  label:    string
  included: boolean
  note?:    string
}

export interface PricingCardProps {
  name:         string
  price:        string
  features:     PricingFeature[]
  period?:      string
  description?: string
  cta?:         string
  onSelect?:    () => void
  highlighted?: boolean
  badge?:       string
  className?:   string
  style?:       React.CSSProperties
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4 text-success flex-shrink-0">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4 text-faint/40 flex-shrink-0">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

export function PricingCard({
  name,
  price,
  features,
  period      = '/month',
  description,
  cta         = 'Get started',
  onSelect,
  highlighted = false,
  badge,
  className,
  style,
}: PricingCardProps) {
  return (
    <div
      style={style}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 h-full transition-[border-color,box-shadow] duration-[200ms]',
        highlighted
          ? 'border-patina shadow-[0_0_0_3px_color-mix(in_srgb,var(--ks-primary)_20%,transparent)] bg-raised'
          : 'border-rule bg-raised',
        className,
      )}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-patina text-patina-fg text-[0.65rem] font-bold uppercase tracking-wide whitespace-nowrap">
          {badge}
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-body-callout font-semibold text-foreground">{name}</h3>
        {description && <p className="text-body-caption text-faint mt-1">{description}</p>}
      </div>

      <div className="flex items-baseline gap-0.5 mb-6">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {period && <span className="text-body-caption text-faint">{period}</span>}
      </div>

      <ul className="flex flex-col gap-3 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className={cn('flex items-start gap-2', !f.included && 'opacity-40')}>
            {f.included ? <CheckIcon /> : <XIcon />}
            <span className="text-body-callout text-foreground">
              {f.label}
              {f.note && <span className="ml-1 text-faint text-body-caption">({f.note})</span>}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'w-full py-2.5 rounded-xl text-body-callout font-semibold transition-[filter,opacity] duration-[120ms]',
          highlighted
            ? 'bg-patina text-patina-fg hover:brightness-110'
            : 'bg-graphite text-foreground border border-rule hover:bg-graphite-2',
        )}
      >
        {cta}
      </button>
    </div>
  )
}
