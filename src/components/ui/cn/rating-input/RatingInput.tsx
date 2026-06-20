'use client'
import type React from 'react'
import { useState, useId } from 'react'
import { cn } from '@/lib/utils'

export type RatingInputSize = 'sm' | 'md' | 'lg'

export interface RatingInputProps {
  value?:        number
  defaultValue?: number
  onChange?:     (value: number) => void
  max?:          number
  size?:         RatingInputSize
  icon?:         React.ReactNode
  emptyIcon?:    React.ReactNode
  label?:        string
  showValue?:    boolean
  disabled?:     boolean
  readOnly?:     boolean
  className?:    string
  style?:        React.CSSProperties
}

const SIZE_ICON: Record<RatingInputSize, string> = {
  sm: 'text-lg leading-none',
  md: 'text-2xl leading-none',
  lg: 'text-3xl leading-none',
}

export function RatingInput({
  value,
  defaultValue = 0,
  onChange,
  max          = 5,
  size         = 'md',
  icon         = '★',
  emptyIcon    = '☆',
  label,
  showValue    = false,
  disabled     = false,
  readOnly     = false,
  className,
  style,
}: RatingInputProps) {
  const uid = useId()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const [hover, setHover]       = useState(0)

  const current   = isControlled ? value! : internal
  const displayed = hover > 0 && !disabled && !readOnly ? hover : current

  function select(v: number) {
    if (disabled || readOnly) return
    const next = current === v ? 0 : v
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div style={style} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={uid} className="text-body-callout font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        id={uid}
        role="group"
        aria-label={label ?? 'Rating'}
        className={cn(
          'inline-flex items-center gap-0.5',
          disabled && 'opacity-50',
        )}
        onMouseLeave={() => { if (!disabled && !readOnly) setHover(0) }}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1
          const filled = n <= displayed
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} out of ${max}`}
              aria-pressed={n === current}
              disabled={disabled}
              onClick={() => select(n)}
              onMouseEnter={() => { if (!disabled && !readOnly) setHover(n) }}
              className={cn(
                'transition-[color,transform] duration-[80ms] bg-transparent border-none p-0 cursor-pointer select-none',
                SIZE_ICON[size],
                filled
                  ? 'text-warning scale-110'
                  : 'text-faint',
                (disabled || readOnly) && 'cursor-default',
                !disabled && !readOnly && 'hover:scale-125',
              )}
            >
              {filled ? icon : emptyIcon}
            </button>
          )
        })}
        {showValue && (
          <span className="ml-2 text-body-callout text-faint tabular-nums">
            {current}/{max}
          </span>
        )}
      </div>
    </div>
  )
}
