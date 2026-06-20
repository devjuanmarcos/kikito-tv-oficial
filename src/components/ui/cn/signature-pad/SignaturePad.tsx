'use client'
import type React from 'react'
import { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface SignaturePadProps {
  width?:           number
  height?:          number
  lineWidth?:       number
  color?:           string
  backgroundColor?: string
  onSave?:          (dataUrl: string) => void
  onClear?:         () => void
  saveLabel?:       string
  clearLabel?:      string
  placeholder?:     string
  readOnly?:        boolean
  className?:       string
  style?:           React.CSSProperties
}

export function SignaturePad({
  width           = 400,
  height          = 160,
  lineWidth       = 2,
  color,
  backgroundColor = 'transparent',
  onSave,
  onClear,
  saveLabel       = 'Save',
  clearLabel      = 'Clear',
  placeholder     = 'Sign here',
  readOnly        = false,
  className,
  style,
}: SignaturePadProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const drawing    = useRef(false)
  const lastPos    = useRef<{ x: number; y: number } | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const strokeColor = color ?? 'oklch(95% 0.01 0)'

  function getCtx() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return null
    ctx.strokeStyle = strokeColor
    ctx.lineWidth   = lineWidth
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    return ctx
  }

  function clientPos(e: MouseEvent | TouchEvent) {
    const r = canvasRef.current!.getBoundingClientRect()
    const src = 'touches' in e ? e.touches[0] : e
    return { x: src.clientX - r.left, y: src.clientY - r.top }
  }

  const onStart = useCallback((e: MouseEvent | TouchEvent) => {
    if (readOnly) return
    e.preventDefault()
    drawing.current = true
    lastPos.current = clientPos(e)
    setIsEmpty(false)
  }, [readOnly])

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!drawing.current || readOnly) return
    e.preventDefault()
    const ctx  = getCtx()
    const curr = clientPos(e)
    if (!ctx || !lastPos.current) return
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(curr.x, curr.y)
    ctx.stroke()
    lastPos.current = curr
  }, [readOnly])

  const onEnd = useCallback(() => {
    drawing.current = false
    lastPos.current = null
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('mousedown',  onStart, { passive: false })
    el.addEventListener('mousemove',  onMove,  { passive: false })
    el.addEventListener('mouseup',    onEnd)
    el.addEventListener('touchstart', onStart, { passive: false })
    el.addEventListener('touchmove',  onMove,  { passive: false })
    el.addEventListener('touchend',   onEnd)
    return () => {
      el.removeEventListener('mousedown',  onStart)
      el.removeEventListener('mousemove',  onMove)
      el.removeEventListener('mouseup',    onEnd)
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove',  onMove)
      el.removeEventListener('touchend',   onEnd)
    }
  }, [onStart, onMove, onEnd])

  function clear() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    setIsEmpty(true)
    onClear?.()
  }

  function save() {
    if (!canvasRef.current || isEmpty) return
    onSave?.(canvasRef.current.toDataURL('image/png'))
  }

  return (
    <div style={style} className={cn('inline-flex flex-col gap-2', className)}>
      <div className="relative rounded-xl border border-rule overflow-hidden" style={{ width, height, background: backgroundColor }}>
        <canvas ref={canvasRef} width={width} height={height} className={cn('block', !readOnly && 'cursor-crosshair')} />
        {isEmpty && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-body-callout text-faint/30 select-none">
            {placeholder}
          </span>
        )}
      </div>
      {!readOnly && (
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={clear}
            className="px-3 py-1.5 rounded-lg text-body-caption border border-rule text-faint hover:text-foreground hover:bg-graphite transition-colors"
          >
            {clearLabel}
          </button>
          <button
            type="button"
            disabled={isEmpty}
            onClick={save}
            className={cn(
              'px-3 py-1.5 rounded-lg text-body-caption bg-patina text-patina-fg hover:brightness-110 transition-[filter]',
              isEmpty && 'opacity-40 pointer-events-none',
            )}
          >
            {saveLabel}
          </button>
        </div>
      )}
    </div>
  )
}
