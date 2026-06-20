'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export interface PasswordStrengthProps {
  value:      string
  showRules?: boolean
  className?: string
  style?:     React.CSSProperties
}

const RULES = [
  { id: 'len',     label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'upper',   label: 'Uppercase letter',       test: (p: string) => /[A-Z]/.test(p) },
  { id: 'digit',   label: 'Number',                 test: (p: string) => /\d/.test(p) },
  { id: 'special', label: 'Special character',      test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

const STRENGTH_COLORS  = ['bg-danger', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success']
const STRENGTH_LABELS  = ['', 'Weak', 'Fair', 'Good', 'Strong']

function getStrength(pwd: string): number {
  return RULES.filter(r => r.test(pwd)).length
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

export function PasswordStrength({
  value,
  showRules = true,
  className,
  style,
}: PasswordStrengthProps) {
  const strength = value.length === 0 ? 0 : getStrength(value)

  return (
    <div style={style} className={cn('flex flex-col gap-2', className)}>
      {/* Bars */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-[background] duration-[200ms]',
              value.length > 0 && n <= strength
                ? STRENGTH_COLORS[strength]
                : 'bg-graphite-2',
            )}
          />
        ))}
        {value.length > 0 && strength > 0 && (
          <span className={cn(
            'text-body-caption font-medium ml-1 whitespace-nowrap',
            strength >= 4 ? 'text-success' : strength >= 3 ? 'text-warning' : 'text-danger',
          )}>
            {STRENGTH_LABELS[strength]}
          </span>
        )}
      </div>

      {/* Rules checklist */}
      {showRules && (
        <ul className="flex flex-col gap-1">
          {RULES.map(rule => {
            const ok = value.length > 0 && rule.test(value)
            return (
              <li key={rule.id} className={cn('flex items-center gap-1.5 text-body-caption', ok ? 'text-success' : 'text-faint')}>
                {ok ? <CheckIcon /> : <XIcon />}
                {rule.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
