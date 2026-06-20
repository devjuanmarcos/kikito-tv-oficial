'use client'
import type React from 'react'
import { useState, useRef, useId } from 'react'
import { cn } from '@/lib/utils'

export type NumberInputSize    = 'sm' | 'md' | 'lg'
export type NumberInputVariant = 'default' | 'ghost' | 'filled'

export interface NumberInputProps {
  value?:        number
  defaultValue?: number
  onChange?:     (value: number) => void
  min?:          number
  max?:          number
  step?:         number
  precision?:    number
  allowDecimal?: boolean
  format?:       (value: number) => string
  parse?:        (value: string) => number
  size?:         NumberInputSize
  variant?:      NumberInputVariant
  label?:        string
  helperText?:   string
  error?:        boolean
  errorMessage?: string
  disabled?:     boolean
  readOnly?:     boolean
  prefix?:       React.ReactNode
  suffix?:       React.ReactNode
  id?:           string
  className?:    string
  style?:        React.CSSProperties
}

const SIZE: Record<NumberInputSize, string> = {
  sm: 'h-7  text-[0.8125rem]',
  md: 'h-9  text-body-callout',
  lg: 'h-11 text-body-paragraph',
}
const SIZE_BTN: Record<NumberInputSize, string> = {
  sm: 'w-6',
  md: 'w-7',
  lg: 'w-8',
}
const VARIANT_WRAP: Record<NumberInputVariant, string> = {
  default: 'border border-rule bg-raised',
  ghost:   'border border-transparent bg-transparent hover:bg-graphite',
  filled:  'border border-transparent bg-graphite-2',
}

const PlusIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const MinusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-3 h-3"><line x1="5" y1="12" x2="19" y2="12"/></svg>

function round(v: number, precision: number) {
  const f = Math.pow(10, precision)
  return Math.round(v * f) / f
}

export function NumberInput({
  value,
  defaultValue = 0,
  onChange,
  min,
  max,
  step         = 1,
  precision    = 0,
  allowDecimal = false,
  format,
  parse,
  size         = 'md',
  variant      = 'default',
  label,
  helperText,
  error        = false,
  errorMessage,
  disabled     = false,
  readOnly     = false,
  prefix,
  suffix,
  id,
  className,
  style,
}: NumberInputProps) {
  const uid = useId()
  const inputId = id ?? uid

  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const [inputStr, setInputStr] = useState(String(isControlled ? value : defaultValue))
  const [focused, setFocused]   = useState(false)

  const current = isControlled ? value! : internal

  function clampVal(v: number) {
    let n = round(v, precision)
    if (min !== undefined) n = Math.max(min, n)
    if (max !== undefined) n = Math.min(max, n)
    return n
  }

  function set(n: number) {
    const clamped = clampVal(n)
    if (!isControlled) setInternal(clamped)
    setInputStr(format ? format(clamped) : String(clamped))
    onChange?.(clamped)
  }

  function increment() { set(current + step) }
  function decrement() { set(current - step) }

  function handleFocus() {
    setFocused(true)
    setInputStr(String(current))
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFocused(false)
    const parsed = parse ? parse(e.target.value) : parseFloat(e.target.value)
    if (!isNaN(parsed)) set(parsed)
    else setInputStr(format ? format(current) : String(current))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputStr(e.target.value)
  }

  const displayValue = focused
    ? inputStr
    : format ? format(current) : String(current)

  const atMin = min !== undefined && current <= min
  const atMax = max !== undefined && current >= max

  return (
    <div style={style} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={inputId} className="text-body-callout font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center rounded-[--radius-md] overflow-hidden transition-[border-color] duration-[120ms] focus-within:border-patina',
          SIZE[size],
          VARIANT_WRAP[variant],
          error    ? '!border-danger' : '',
          disabled ? 'opacity-50 pointer-events-none' : '',
        )}
      >
        {prefix && (
          <span className="flex items-center px-2 text-faint shrink-0">{prefix}</span>
        )}
        <input
          id={inputId}
          type="text"
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={readOnly}
          disabled={disabled}
          onKeyDown={e => {
            if (e.key === 'ArrowUp')   { e.preventDefault(); increment() }
            if (e.key === 'ArrowDown') { e.preventDefault(); decrement() }
          }}
          className="flex-1 min-w-0 h-full bg-transparent outline-none text-foreground text-center tabular-nums px-1"
        />
        {suffix && (
          <span className="flex items-center px-2 text-faint shrink-0">{suffix}</span>
        )}
        <div className={cn('flex flex-col h-full border-l border-rule shrink-0', SIZE_BTN[size])}>
          <button
            type="button"
            aria-label="Increment"
            onClick={increment}
            disabled={disabled || readOnly || atMax}
            className="flex-1 flex items-center justify-center text-faint hover:text-foreground hover:bg-graphite transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <PlusIcon />
          </button>
          <div className="h-px bg-rule" />
          <button
            type="button"
            aria-label="Decrement"
            onClick={decrement}
            disabled={disabled || readOnly || atMin}
            className="flex-1 flex items-center justify-center text-faint hover:text-foreground hover:bg-graphite transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <MinusIcon />
          </button>
        </div>
      </div>
      {error && errorMessage && (
        <p className="text-body-caption text-danger">{errorMessage}</p>
      )}
      {!error && helperText && (
        <p className="text-body-caption text-faint">{helperText}</p>
      )}
    </div>
  )
}
