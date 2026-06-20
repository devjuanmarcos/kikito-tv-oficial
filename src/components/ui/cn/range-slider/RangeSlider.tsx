'use client'
import type React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface RangeSliderProps {
  min?:         number
  max?:         number
  step?:        number
  value?:       [number, number]
  defaultValue?: [number, number]
  onChange?:    (value: [number, number]) => void
  formatValue?: (value: number) => string
  label?:       string
  showValues?:  boolean
  disabled?:    boolean
  className?:   string
  style?:       React.CSSProperties
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function snapToStep(v: number, min: number, step: number) { return Math.round((v - min) / step) * step + min }

export function RangeSlider({
  min         = 0,
  max         = 100,
  step        = 1,
  value,
  defaultValue = [25, 75],
  onChange,
  formatValue  = String,
  label,
  showValues   = true,
  disabled     = false,
  className,
  style,
}: RangeSliderProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<[number, number]>(defaultValue)
  const [lo, hi] = isControlled ? value! : internal

  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'lo' | 'hi' | null>(null)

  function pct(v: number) { return ((v - min) / (max - min)) * 100 }

  const updateFromClient = useCallback((clientX: number) => {
    if (!trackRef.current || !dragging.current) return
    const { left, width } = trackRef.current.getBoundingClientRect()
    const ratio = clamp((clientX - left) / width, 0, 1)
    const raw   = min + ratio * (max - min)
    const snapped = clamp(snapToStep(raw, min, step), min, max)

    const [curLo, curHi] = isControlled ? value! : internal
    let next: [number, number]
    if (dragging.current === 'lo') {
      next = [clamp(snapped, min, curHi - step), curHi]
    } else {
      next = [curLo, clamp(snapped, curLo + step, max)]
    }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }, [min, max, step, isControlled, value, internal, onChange])

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
      updateFromClient(cx)
    }
    function onUp() { dragging.current = null }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
    }
  }, [updateFromClient])

  function startDrag(which: 'lo' | 'hi') {
    return (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return
      e.preventDefault()
      dragging.current = which
    }
  }

  const THUMB = 'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-patina border-2 border-raised shadow-[0_0_0_2px_var(--ks-patina)] cursor-grab active:cursor-grabbing transition-shadow duration-[80ms] focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--ks-patina)/50]'

  return (
    <div style={style} className={cn('flex flex-col gap-2', disabled && 'opacity-50 pointer-events-none', className)}>
      {(label || showValues) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-body-callout font-medium text-foreground">{label}</span>}
          {showValues && (
            <span className="text-body-callout text-faint tabular-nums">
              {formatValue(lo)} – {formatValue(hi)}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className="relative h-1.5 rounded-full bg-graphite-2 cursor-pointer"
        onClick={e => {
          if (disabled || dragging.current) return
          const { left, width } = trackRef.current!.getBoundingClientRect()
          const ratio   = clamp((e.clientX - left) / width, 0, 1)
          const snapped = clamp(snapToStep(min + ratio * (max - min), min, step), min, max)
          const midPct  = (pct(lo) + pct(hi)) / 2
          const clickPct = ratio * 100
          const which = clickPct < midPct ? 'lo' : 'hi'
          const next: [number, number] = which === 'lo'
            ? [clamp(snapped, min, hi - step), hi]
            : [lo, clamp(snapped, lo + step, max)]
          if (!isControlled) setInternal(next)
          onChange?.(next)
        }}
      >
        {/* fill */}
        <div
          className="absolute top-0 h-full bg-patina rounded-full"
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
        />

        {/* lo thumb */}
        <button
          type="button"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={hi - step}
          aria-valuenow={lo}
          aria-label="Minimum value"
          className={THUMB}
          style={{ left: `${pct(lo)}%` }}
          onMouseDown={startDrag('lo')}
          onTouchStart={startDrag('lo')}
          onKeyDown={e => {
            const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step : 0
            if (!delta) return
            const next: [number, number] = [clamp(lo + delta, min, hi - step), hi]
            if (!isControlled) setInternal(next)
            onChange?.(next)
          }}
        />

        {/* hi thumb */}
        <button
          type="button"
          tabIndex={0}
          aria-valuemin={lo + step}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-label="Maximum value"
          className={THUMB}
          style={{ left: `${pct(hi)}%` }}
          onMouseDown={startDrag('hi')}
          onTouchStart={startDrag('hi')}
          onKeyDown={e => {
            const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step : 0
            if (!delta) return
            const next: [number, number] = [lo, clamp(hi + delta, lo + step, max)]
            if (!isControlled) setInternal(next)
            onChange?.(next)
          }}
        />
      </div>
    </div>
  )
}
