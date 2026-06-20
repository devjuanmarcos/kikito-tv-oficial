'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { ColorPickerProps } from './color-picker.types'

const DEFAULT_SWATCHES = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#1e293b', '#ffffff', '#000000',
]

function isValidHex(hex: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
}

export function ColorPicker({
  value,
  defaultValue = '#3b82f6',
  onChange,
  swatches     = DEFAULT_SWATCHES,
  showInput    = true,
  disabled     = false,
  className,
  style,
}: ColorPickerProps) {
  const controlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const [inputVal, setInputVal] = useState(controlled ? (value ?? defaultValue) : defaultValue)
  const current                 = controlled ? (value ?? defaultValue) : internal

  const update = useCallback((hex: string) => {
    if (!controlled) setInternal(hex)
    setInputVal(hex)
    onChange?.(hex)
  }, [controlled, onChange])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setInputVal(v)
    if (isValidHex(v)) update(v)
  }

  function handleInputBlur() {
    if (!isValidHex(inputVal)) setInputVal(current)
  }

  return (
    <div className={cn('inline-flex flex-col gap-[10px]', className)} style={style}>
      {swatches.length > 0 && (
        <div className="flex flex-wrap gap-[6px]">
          {swatches.map(swatch => (
            <button
              key={swatch}
              className={cn(
                'w-7 h-7 rounded-[--radius-sm] border-2 border-transparent cursor-pointer p-0 transition-[transform,border-color] duration-[150ms] hover:scale-[1.12]',
                current.toLowerCase() === swatch.toLowerCase() && 'border-foreground shadow-[0_0_0_1px_var(--ks-lacquer)]',
                disabled && 'opacity-40 cursor-not-allowed',
              )}
              style={{ background: swatch }}
              onClick={() => update(swatch)}
              disabled={disabled}
              aria-label={`Select color ${swatch}`}
              title={swatch}
            />
          ))}
        </div>
      )}

      {showInput && (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-[--radius-sm] border-[1.5px] border-rule flex-shrink-0"
            style={{ background: current }}
          />
          <input
            className="flex-1 py-[7px] px-[10px] rounded-[7px] border-[1.5px] border-rule bg-raised text-foreground text-body-callout font-mono outline-none transition-[border-color] duration-[150ms] uppercase focus:border-patina disabled:opacity-40 disabled:cursor-not-allowed"
            type="text"
            value={inputVal.toUpperCase()}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={disabled}
            maxLength={7}
            placeholder="#000000"
          />
          <input
            type="color"
            className="w-8 h-8 rounded-[--radius-sm] border-[1.5px] border-rule p-[2px] cursor-pointer bg-raised overflow-hidden"
            value={current}
            onChange={e => update(e.target.value)}
            disabled={disabled}
            title="Open color picker"
          />
        </div>
      )}
    </div>
  )
}
