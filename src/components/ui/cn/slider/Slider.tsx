'use client'
import type React from 'react'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

export type SliderSize   = 'sm' | 'md' | 'lg'
export type SliderIntent = 'primary' | 'info' | 'success' | 'warning' | 'danger'

export interface SliderMark {
  value:  number
  label?: string
}

export interface SliderProps {
  value?:        number
  defaultValue?: number
  onChange?:     (value: number) => void
  min?:          number
  max?:          number
  step?:         number
  label?:        string
  showValue?:    boolean
  formatValue?:  (v: number) => string
  marks?:        SliderMark[]
  size?:         SliderSize
  intent?:       SliderIntent
  disabled?:     boolean
  className?:    string
  style?:        React.CSSProperties
}

const SIZE_TRACK: Record<SliderSize, string> = {
  sm: 'h-1',
  md: 'h-[5px]',
  lg: 'h-2',
}
const SIZE_THUMB: Record<SliderSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}
const INTENT_CLS: Record<SliderIntent, string> = {
  primary: 'bg-patina',
  info:    'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

export function Slider({
  value,
  defaultValue = 0,
  onChange,
  min      = 0,
  max      = 100,
  step     = 1,
  label,
  showValue = false,
  formatValue,
  marks,
  size   = 'md',
  intent = 'primary',
  disabled = false,
  className,
  style,
}: SliderProps) {
  const uid = useId()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const current = isControlled ? (value ?? min) : internal

  const pct = ((current - min) / (max - min)) * 100

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  const displayVal = formatValue ? formatValue(current) : String(current)

  return (
    <div className={cn('flex flex-col gap-1', className)} style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3">
          {label    && <label className="text-body-callout font-semibold text-foreground" htmlFor={uid}>{label}</label>}
          {showValue && <span className="text-body-callout text-faint tabular-nums shrink-0">{displayVal}</span>}
        </div>
      )}

      <div className={cn('relative flex items-center', marks ? 'pb-5' : '', disabled && 'opacity-50')}>
        {/* track */}
        <div className={cn('relative w-full rounded-full bg-graphite-2', SIZE_TRACK[size])}>
          {/* fill */}
          <div
            className={cn('absolute left-0 top-0 h-full rounded-full transition-[width] duration-[80ms]', INTENT_CLS[intent])}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* native range */}
        <input
          id={uid}
          type="range"
          min={min}
          max={max}
          step={step}
          value={isControlled ? current : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          disabled={disabled}
          onChange={handleChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ height: '100%' }}
        />

        {/* thumb */}
        <div
          className={cn('absolute rounded-full bg-white border-2 shadow-sm pointer-events-none transition-[left] duration-[80ms]', SIZE_THUMB[size], INTENT_CLS[intent].replace('bg-', 'border-'))}
          style={{ left: `calc(${pct}% - ${size === 'sm' ? 6 : size === 'md' ? 8 : 10}px)` }}
        />

        {/* marks */}
        {marks && (
          <div className="absolute inset-x-0 top-full mt-1 pointer-events-none">
            {marks.map(m => {
              const mPct = ((m.value - min) / (max - min)) * 100
              return (
                <div key={m.value} className="absolute flex flex-col items-center gap-0.5" style={{ left: `${mPct}%`, transform: 'translateX(-50%)' }}>
                  <div className="w-px h-1 bg-rule" />
                  {m.label && <span className="text-[0.625rem] text-faint whitespace-nowrap">{m.label}</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
