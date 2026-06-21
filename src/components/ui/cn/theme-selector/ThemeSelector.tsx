'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ThemeSelectorProps } from './theme-selector.types'

export function ThemeSelector({
  themes,
  value,
  defaultValue,
  onChange,
  className,
  style,
}: ThemeSelectorProps) {
  const [internal, setInternal] = useState(defaultValue ?? themes[0]?.id)
  const controlled = value !== undefined
  const selected = controlled ? value : internal

  function select(id: string) {
    if (!controlled) setInternal(id)
    onChange?.(id)
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)} style={style}>
      {themes.map(theme => (
        <button
          key={theme.id}
          type="button"
          onClick={() => select(theme.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-[--radius] border transition-[border-color,background] duration-[150ms] cursor-pointer font-[inherit] bg-raised',
            selected === theme.id
              ? 'border-patina bg-patina-soft'
              : 'border-rule hover:border-[var(--ks-primary)] hover:bg-graphite'
          )}
        >
          <div className="grid grid-cols-2 gap-[2px] w-7 h-7 rounded-sm overflow-hidden shrink-0">
            {theme.colors.slice(0, 4).map((c, i) => (
              <div key={i} style={{ background: c }} className="w-full h-full" />
            ))}
          </div>
          <span className="text-body-callout font-medium text-foreground whitespace-nowrap">{theme.label}</span>
          <span
            className={cn(
              'text-patina text-body-caption font-bold transition-opacity duration-[150ms]',
              selected === theme.id ? 'opacity-100' : 'opacity-0'
            )}
          >
            ✓
          </span>
        </button>
      ))}
    </div>
  )
}
