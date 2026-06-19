'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { OtpInputProps } from './otp-input.types'

const SIZE_WRAP: Record<string, string> = {
  sm: 'gap-[6px]',
  md: 'gap-[8px]',
  lg: 'gap-[10px]',
}

const SIZE_CELL: Record<string, string> = {
  sm: 'w-9 h-9 text-[1rem]',
  md: 'w-12 h-12 text-[1.25rem]',
  lg: 'w-[3.75rem] h-[3.75rem] text-[1.625rem]',
}

const VARIANT_CELL: Record<string, string> = {
  outline:   'border border-rule bg-raised focus:border-patina rounded-[--radius-sm]',
  filled:    'border border-transparent bg-graphite focus:border-patina rounded-[--radius-sm]',
  underline: 'border-0 border-b-2 border-rule rounded-none bg-transparent focus:border-patina',
}

export function OtpInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  variant = 'outline',
  size = 'md',
  disabled = false,
  invalid = false,
  mask = false,
  className,
  style,
}: OtpInputProps) {
  const controlled = value !== undefined
  const [internal, setInternal] = useState<string[]>(
    () => (controlled ? value! : defaultValue).split('').slice(0, length)
  )
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const cells = controlled
    ? value!.padEnd(length, '').split('').slice(0, length)
    : internal

  const update = useCallback((next: string[]) => {
    const str = next.join('')
    if (!controlled) setInternal(next)
    onChange?.(str)
    if (str.length === length && !next.includes('')) onComplete?.(str)
  }, [controlled, length, onChange, onComplete])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) return
    const char = raw[raw.length - 1]
    const next = [...cells]; next[i] = char
    update(next)
    refs.current[i + 1]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...cells]
      if (next[i]) { next[i] = ''; update(next) }
      else { refs.current[i - 1]?.focus(); next[i - 1] = ''; update(next) }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); refs.current[i + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent, i: number) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length - i)
    const next = [...cells]
    pasted.split('').forEach((ch, idx) => { next[i + idx] = ch })
    update(next)
    refs.current[Math.min(i + pasted.length, length - 1)]?.focus()
  }

  return (
    <div className={cn('inline-flex items-center', SIZE_WRAP[size] ?? SIZE_WRAP.md, className)} style={style}>
      {cells.map((cell, i) => (
        <span key={i} className="contents">
          {i === 3 && length === 6 && (
            <span className="text-xl opacity-30 mx-0.5 select-none">—</span>
          )}
          <input
            ref={el => { refs.current[i] = el }}
            className={cn(
              'text-center text-foreground font-semibold outline-none transition-[border-color] duration-150',
              SIZE_CELL[size] ?? SIZE_CELL.md,
              VARIANT_CELL[variant] ?? VARIANT_CELL.outline,
              cell && 'border-patina',
              invalid && 'border-danger',
              disabled && 'opacity-40 cursor-not-allowed',
            )}
            type={mask ? 'password' : 'text'}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={cell}
            disabled={disabled}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            onPaste={e => handlePaste(e, i)}
            onFocus={e => e.target.select()}
            aria-label={`OTP digit ${i + 1}`}
          />
        </span>
      ))}
    </div>
  )
}
