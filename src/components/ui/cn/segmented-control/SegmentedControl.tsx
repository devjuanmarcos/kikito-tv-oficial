'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface SegmentedControlOption<T extends string = string> {
  value:    T
  label:    React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string = string> {
  options:       SegmentedControlOption<T>[]
  value?:        T
  defaultValue?: T
  onChange?:     (value: T) => void
  size?:         'sm' | 'md' | 'lg'
  fullWidth?:    boolean
  className?:    string
  style?:        React.CSSProperties
}

const SIZE_WRAP: Record<string, string> = {
  sm: 'p-0.5 gap-0.5 rounded-[--radius-sm]',
  md: 'p-[3px] gap-[3px] rounded-[--radius-md]',
  lg: 'p-1 gap-1 rounded-[--radius-md]',
}
const SIZE_BTN: Record<string, string> = {
  sm: 'h-6  px-2.5 text-[0.6875rem] rounded-[calc(var(--radius-sm)-2px)]',
  md: 'h-7  px-3   text-body-caption rounded-[calc(var(--radius-md)-3px)]',
  lg: 'h-8  px-4   text-body-callout rounded-[calc(var(--radius-md)-4px)]',
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  size      = 'md',
  fullWidth = false,
  className,
  style,
}: SegmentedControlProps<T>) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<T | undefined>(defaultValue)
  const active = isControlled ? value : internal

  function select(v: T) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  return (
    <div
      role="group"
      style={style}
      className={cn(
        'inline-flex bg-graphite-2 border border-rule',
        SIZE_WRAP[size],
        fullWidth && 'flex w-full',
        className,
      )}
    >
      {options.map(opt => {
        const isActive = active === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            disabled={opt.disabled}
            onClick={() => !opt.disabled && select(opt.value)}
            className={cn(
              'inline-flex items-center justify-center font-medium transition-[background,color,box-shadow] duration-[120ms] select-none',
              SIZE_BTN[size],
              fullWidth && 'flex-1',
              isActive
                ? 'bg-raised text-foreground shadow-[0_1px_3px_-1px_oklch(0%_0_0/0.25),0_0_0_1px_var(--ks-rule)]'
                : 'text-faint hover:text-foreground',
              opt.disabled && 'opacity-40 cursor-not-allowed',
            )}
            aria-pressed={isActive}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
