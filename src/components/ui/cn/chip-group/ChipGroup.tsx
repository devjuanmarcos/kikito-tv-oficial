'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type ChipGroupIntent = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type ChipGroupSize   = 'sm' | 'md' | 'lg'

export interface ChipGroupChip {
  id:        string
  label:     string
  icon?:     React.ReactNode
  disabled?: boolean
}

export interface ChipGroupProps {
  chips:        ChipGroupChip[]
  value?:       string[]
  defaultValue?: string[]
  onChange?:    (value: string[]) => void
  multiSelect?: boolean
  intent?:      ChipGroupIntent
  size?:        ChipGroupSize
  className?:   string
  style?:       React.CSSProperties
}

const SIZE_CLS: Record<ChipGroupSize, string> = {
  sm: 'h-7  px-2.5 text-[0.7rem] gap-1   rounded-md',
  md: 'h-8  px-3   text-[0.75rem] gap-1.5 rounded-lg',
  lg: 'h-10 px-4   text-sm gap-2  rounded-lg',
}

const INTENT_ACTIVE: Record<ChipGroupIntent, string> = {
  primary:   'bg-patina text-patina-fg border-patina',
  secondary: 'bg-kinpaku text-kinpaku-fg border-kinpaku',
  success:   'bg-success text-success-fg border-success',
  warning:   'bg-warning text-warning-fg border-warning',
  danger:    'bg-danger text-danger-fg border-danger',
  info:      'bg-info text-info-fg border-info',
  neutral:   'bg-raised text-foreground border-foreground/30',
}

export function ChipGroup({
  chips,
  value,
  defaultValue = [],
  onChange,
  multiSelect = true,
  intent      = 'primary',
  size        = 'md',
  className,
  style,
}: ChipGroupProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<string[]>(defaultValue)
  const selected = isControlled ? value! : internal

  function toggle(id: string) {
    let next: string[]
    if (multiSelect) {
      next = selected.includes(id)
        ? selected.filter(v => v !== id)
        : [...selected, id]
    } else {
      next = selected[0] === id ? [] : [id]
    }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div style={style} role="group" className={cn('flex flex-wrap gap-2', className)}>
      {chips.map(chip => {
        const active = selected.includes(chip.id)
        return (
          <button
            key={chip.id}
            type="button"
            disabled={chip.disabled}
            aria-pressed={active}
            onClick={() => toggle(chip.id)}
            className={cn(
              'inline-flex items-center border font-medium select-none',
              'transition-[background,color,border-color,opacity] duration-[100ms]',
              SIZE_CLS[size],
              active
                ? INTENT_ACTIVE[intent]
                : 'bg-transparent text-faint border-rule hover:border-foreground/30 hover:text-foreground',
              chip.disabled && 'opacity-40 pointer-events-none',
            )}
          >
            {chip.icon && <span className="leading-none">{chip.icon}</span>}
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
