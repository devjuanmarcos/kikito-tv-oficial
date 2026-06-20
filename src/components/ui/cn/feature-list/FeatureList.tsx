'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type FeatureListVariant = 'check' | 'numbered' | 'icon'
export type FeatureListIntent  = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface FeatureItem {
  title:        string
  description?: string
  icon?:        React.ReactNode
  available?:   boolean
}

export interface FeatureListProps {
  items:      FeatureItem[]
  variant?:   FeatureListVariant
  intent?:    FeatureListIntent
  className?: string
  style?:     React.CSSProperties
}

const INTENT_CLS: Record<FeatureListIntent, string> = {
  primary: 'text-patina bg-patina/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger:  'text-danger bg-danger/10',
  info:    'text-info bg-info/10',
  neutral: 'text-foreground bg-graphite',
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

export function FeatureList({
  items,
  variant = 'check',
  intent  = 'primary',
  className,
  style,
}: FeatureListProps) {
  return (
    <ul style={style} className={cn('flex flex-col gap-3', className)}>
      {items.map((item, i) => {
        const available = item.available !== false
        return (
          <li
            key={i}
            className={cn(
              'flex items-start gap-3',
              !available && 'opacity-40',
            )}
          >
            {/* Indicator */}
            {variant === 'check' && (
              <span className={cn('flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full', available ? INTENT_CLS[intent] : 'bg-graphite text-faint')}>
                {available ? <CheckIcon /> : <XIcon />}
              </span>
            )}
            {variant === 'numbered' && (
              <span className={cn('flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[0.65rem] font-bold', INTENT_CLS[intent])}>
                {i + 1}
              </span>
            )}
            {variant === 'icon' && (
              <span className={cn('flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-lg', INTENT_CLS[intent])}>
                {item.icon}
              </span>
            )}

            <div>
              <p className="text-body-callout font-medium text-foreground">{item.title}</p>
              {item.description && (
                <p className="text-body-caption text-faint mt-0.5">{item.description}</p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
