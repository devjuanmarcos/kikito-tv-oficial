'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TimePickerProps, TimeValue } from './time-picker.types'

function pad(n: number) { return String(n).padStart(2, '0') }

function fmt(v: TimeValue, format: string) {
  if (!v) return ''
  if (format === '12') {
    const h12 = v.hours % 12 || 12
    return `${pad(h12)}:${pad(v.minutes)} ${v.period ?? 'AM'}`
  }
  return `${pad(v.hours)}:${pad(v.minutes)}`
}

export function TimePicker({
  value: controlled,
  defaultValue,
  onChange,
  format = '24',
  minuteStep = 5,
  placeholder = 'Select time',
  disabled = false,
  className,
  style,
}: TimePickerProps) {
  const [internal, setInternal] = useState<TimeValue>(defaultValue ?? { hours: 0, minutes: 0, period: 'AM' })
  const [open, setOpen] = useState(false)
  const isControlled = controlled !== undefined
  const val = isControlled ? controlled! : internal
  const rootRef = useRef<HTMLDivElement>(null)

  const hours = format === '12'
    ? Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i)
    : Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep)

  const update = (next: Partial<TimeValue>) => {
    const merged = { ...val, ...next }
    if (!isControlled) setInternal(merged)
    onChange?.(merged)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayH = format === '12' ? (val.hours % 12 || 12) : val.hours
  const isEmpty = !defaultValue && val.hours === 0 && val.minutes === 0

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)} style={style}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-[--radius-sm] border text-body-callout min-w-[140px]',
          'transition-colors duration-150',
          open ? 'border-patina bg-raised' : 'border-rule bg-canvas hover:border-patina/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span>🕐</span>
        <span className={isEmpty ? 'text-faint' : 'text-foreground'}>
          {isEmpty ? placeholder : fmt(val, format)}
        </span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-raised border border-rule rounded-[--radius-md] shadow-lg flex items-stretch overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
          {/* Hours */}
          <div className="flex flex-col">
            <div className="text-[0.625rem] font-bold text-faint uppercase tracking-widest px-3 py-1.5 border-b border-rule">Hour</div>
            <div className="overflow-y-auto max-h-44 py-1">
              {hours.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    const newH = format === '12'
                      ? (h === 12 ? (val.period === 'PM' ? 12 : 0) : h + (val.period === 'PM' ? 12 : 0))
                      : h
                    update({ hours: newH })
                  }}
                  className={cn(
                    'block w-full px-4 py-1 text-center text-body-callout hover:bg-graphite transition-colors',
                    displayH === h ? 'bg-patina text-patina-fg font-bold' : 'text-foreground'
                  )}
                >
                  {pad(h)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center px-1 text-muted font-bold">:</div>

          {/* Minutes */}
          <div className="flex flex-col">
            <div className="text-[0.625rem] font-bold text-faint uppercase tracking-widest px-3 py-1.5 border-b border-rule">Min</div>
            <div className="overflow-y-auto max-h-44 py-1">
              {minutes.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update({ minutes: m })}
                  className={cn(
                    'block w-full px-4 py-1 text-center text-body-callout hover:bg-graphite transition-colors',
                    val.minutes === m ? 'bg-patina text-patina-fg font-bold' : 'text-foreground'
                  )}
                >
                  {pad(m)}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM */}
          {format === '12' && (
            <div className="flex flex-col border-l border-rule">
              <div className="text-[0.625rem] font-bold text-faint uppercase tracking-widest px-3 py-1.5 border-b border-rule">Period</div>
              <div className="flex flex-col gap-1 p-2">
                {(['AM', 'PM'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update({ period: p })}
                    className={cn(
                      'px-3 py-1 rounded-[--radius-sm] text-body-callout font-medium transition-colors',
                      val.period === p ? 'bg-patina text-patina-fg' : 'text-foreground hover:bg-graphite'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
