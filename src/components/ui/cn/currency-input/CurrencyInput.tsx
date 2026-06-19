'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { CurrencyInputProps } from './currency-input.types'

function getSymbol(currency: string, locale: string) {
  try {
    return (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0 })
      .replace(/[\d\s,.']+/g, '').trim()
  } catch {
    return currency
  }
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'USD',
  locale = 'en-US',
  min,
  max,
  step = 0.01,
  placeholder = '0.00',
  disabled = false,
  label,
  className,
  style,
}: CurrencyInputProps) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const symbol = getSymbol(currency, locale)

  const formatted = value !== undefined && value !== null
    ? value.toLocaleString(locale, { style: 'currency', currency })
    : ''

  function onFocus() {
    setRaw(value !== undefined && value !== null ? String(value) : '')
    setEditing(true)
    requestAnimationFrame(() => inputRef.current?.select())
  }

  function commit() {
    const parsed = parseFloat(raw.replace(/[^0-9.\-]/g, ''))
    if (!isNaN(parsed)) {
      let clamped = parsed
      if (min !== undefined) clamped = Math.max(min, clamped)
      if (max !== undefined) clamped = Math.min(max, clamped)
      onChange?.(clamped)
    }
    setEditing(false)
  }

  return (
    <div className={cn('flex flex-col gap-1', className)} style={style}>
      {label && <label className="text-[0.8125rem] font-medium text-muted">{label}</label>}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-[--radius-sm] border border-rule bg-canvas transition-colors',
        !disabled && 'focus-within:border-patina/60',
        disabled && 'opacity-60 cursor-not-allowed'
      )}>
        <span className="text-faint text-[0.875rem] shrink-0">{symbol}</span>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            step={step}
            min={min}
            max={max}
            value={raw}
            onChange={e => setRaw(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') commit() }}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-foreground text-[0.875rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <input
            type="text"
            readOnly={!editing}
            value={formatted}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-foreground text-[0.875rem] cursor-text placeholder:text-faint"
          />
        )}
      </div>
    </div>
  )
}
