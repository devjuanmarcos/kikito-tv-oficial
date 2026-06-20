'use client'
import type React from 'react'
import { useId, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export type CheckboxSize    = 'sm' | 'md' | 'lg'
export type CheckboxVariant = 'square' | 'rounded' | 'circle'
export type CheckboxIntent  = 'primary' | 'secondary' | 'success' | 'destructive' | 'warning' | 'info'

export interface CheckboxProps {
  checked?:        boolean
  defaultChecked?: boolean
  indeterminate?:  boolean
  onChange?:       (checked: boolean) => void
  label?:          string
  description?:    string
  size?:           CheckboxSize
  variant?:        CheckboxVariant
  intent?:         CheckboxIntent
  disabled?:       boolean
  className?:      string
  style?:          React.CSSProperties
}

const SIZE_CLS: Record<CheckboxSize, { box: string; label: string; desc: string }> = {
  sm: { box: 'w-3.5 h-3.5',   label: 'text-body-caption',   desc: 'text-[0.6875rem]' },
  md: { box: 'w-4 h-4',       label: 'text-body-callout',   desc: 'text-body-caption' },
  lg: { box: 'w-[1.125rem] h-[1.125rem]', label: 'text-body-paragraph', desc: 'text-body-callout' },
}
const VARIANT_CLS: Record<CheckboxVariant, string> = {
  square:  'rounded-none',
  rounded: 'rounded-[4px]',
  circle:  'rounded-full',
}
const INTENT_CHECKED: Record<CheckboxIntent, string> = {
  primary:     'bg-patina border-patina',
  secondary:   'bg-foreground border-foreground',
  success:     'bg-success border-success',
  destructive: 'bg-danger border-danger',
  warning:     'bg-warning border-warning',
  info:        'bg-info border-info',
}

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <polyline points="2,6 5,9 10,3" />
  </svg>
)
const MinusIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-full h-full">
    <line x1="2" y1="6" x2="10" y2="6" />
  </svg>
)

export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate  = false,
  onChange,
  label,
  description,
  size    = 'md',
  variant = 'rounded',
  intent  = 'primary',
  disabled = false,
  className,
  style,
}: CheckboxProps) {
  const uid = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = checked !== undefined
  const isChecked    = isControlled ? checked : undefined

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const visualChecked = indeterminate ? true : (isChecked ?? defaultChecked)
  const sz = SIZE_CLS[size]

  return (
    <label
      className={cn('inline-flex items-start gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}
      style={style}
      htmlFor={uid}
    >
      <span className={cn('relative shrink-0 mt-[0.1em] border-2 border-rule bg-raised transition-[background,border] duration-[120ms]', sz.box, VARIANT_CLS[variant], visualChecked && INTENT_CHECKED[intent])}>
        <input
          ref={inputRef}
          id={uid}
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
        />
        {(visualChecked || indeterminate) && (
          <span className={cn('absolute inset-0 flex items-center justify-center p-[2px] text-white', intent === 'warning' && 'text-black')}>
            {indeterminate ? <MinusIcon /> : <CheckIcon />}
          </span>
        )}
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-[0.1rem]">
          {label       && <span className={cn('font-medium text-foreground leading-tight', sz.label)}>{label}</span>}
          {description && <span className={cn('text-faint leading-[1.4]', sz.desc)}>{description}</span>}
        </span>
      )}
    </label>
  )
}
