'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type ToggleGroupType    = 'single' | 'multiple'
export type ToggleGroupVariant = 'outline' | 'solid' | 'ghost'
export type ToggleGroupSize    = 'sm' | 'md' | 'lg'

export interface ToggleGroupItem {
  value:     string
  label:     React.ReactNode
  disabled?: boolean
}

export interface ToggleGroupProps {
  items:         ToggleGroupItem[]
  type?:         ToggleGroupType
  variant?:      ToggleGroupVariant
  size?:         ToggleGroupSize
  value?:        string | string[]
  defaultValue?: string | string[]
  onChange?:     (value: string | string[]) => void
  className?:    string
  style?:        React.CSSProperties
}

const SIZE_BTN: Record<ToggleGroupSize, string> = {
  sm: 'h-6 px-2   text-[0.6875rem]',
  md: 'h-7 px-2.5 text-body-caption',
  lg: 'h-8 px-3   text-body-callout',
}

const VARIANT_WRAP: Record<ToggleGroupVariant, string> = {
  outline: 'border border-rule rounded-[--radius-sm] p-0.5 gap-0.5 bg-graphite-2',
  solid:   'gap-1',
  ghost:   'gap-0.5',
}

const VARIANT_BTN_BASE: Record<ToggleGroupVariant, string> = {
  outline: 'rounded-[calc(var(--radius-sm)-2px)]',
  solid:   'rounded-[--radius-sm] border border-rule',
  ghost:   'rounded-[--radius-sm]',
}

const VARIANT_BTN_ACTIVE: Record<ToggleGroupVariant, string> = {
  outline: 'bg-raised text-foreground shadow-[0_1px_3px_-1px_oklch(0%_0_0/0.25),0_0_0_1px_var(--ks-rule)]',
  solid:   'bg-patina text-patina-fg border-patina',
  ghost:   'bg-graphite text-foreground',
}

const VARIANT_BTN_INACTIVE: Record<ToggleGroupVariant, string> = {
  outline: 'text-faint hover:text-foreground',
  solid:   'bg-raised text-faint hover:text-foreground hover:bg-graphite',
  ghost:   'text-faint hover:text-foreground hover:bg-graphite-2',
}

export function ToggleGroup({
  items,
  type         = 'single',
  variant      = 'outline',
  size         = 'md',
  value,
  defaultValue,
  onChange,
  className,
  style,
}: ToggleGroupProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<string | string[]>(
    defaultValue ?? (type === 'multiple' ? [] : '')
  )
  const active = isControlled ? value : internal

  function toggle(v: string) {
    if (type === 'multiple') {
      const arr = Array.isArray(active) ? active : []
      const next = arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]
      if (!isControlled) setInternal(next)
      onChange?.(next)
    } else {
      const next = active === v ? '' : v
      if (!isControlled) setInternal(next)
      onChange?.(next)
    }
  }

  function isActive(v: string) {
    if (Array.isArray(active)) return active.includes(v)
    return active === v
  }

  return (
    <div
      role="group"
      style={style}
      className={cn('inline-flex items-center', VARIANT_WRAP[variant], className)}
    >
      {items.map(item => {
        const on = isActive(item.value)
        return (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => !item.disabled && toggle(item.value)}
            aria-pressed={on}
            className={cn(
              'inline-flex items-center justify-center font-medium transition-[background,color,box-shadow] duration-[120ms] select-none',
              SIZE_BTN[size],
              VARIANT_BTN_BASE[variant],
              on ? VARIANT_BTN_ACTIVE[variant] : VARIANT_BTN_INACTIVE[variant],
              item.disabled && 'opacity-40 cursor-not-allowed',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
