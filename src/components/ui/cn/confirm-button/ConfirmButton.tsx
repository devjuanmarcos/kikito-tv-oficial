'use client'

import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ConfirmButtonProps } from './confirm-button.types'

const INTENT_CLASSES: Record<string, string> = {
  primary:   'bg-patina text-patina-fg hover:bg-patina/90',
  secondary: 'bg-kinpaku text-kinpaku-fg hover:bg-kinpaku/90',
  danger:    'bg-danger text-danger-fg hover:bg-danger/90',
  success:   'bg-success text-success-fg hover:bg-success/90',
  warning:   'bg-warning text-warning-fg hover:bg-warning/90',
}

const INTENT_OUTLINE: Record<string, string> = {
  primary:   'border-patina text-patina hover:bg-patina/10',
  secondary: 'border-kinpaku text-kinpaku hover:bg-kinpaku/10',
  danger:    'border-danger text-danger hover:bg-danger/10',
  success:   'border-success text-success hover:bg-success/10',
  warning:   'border-warning text-warning hover:bg-warning/10',
}

const INTENT_SOFT: Record<string, string> = {
  primary:   'bg-patina/12 text-patina hover:bg-patina/20',
  secondary: 'bg-kinpaku/12 text-kinpaku hover:bg-kinpaku/20',
  danger:    'bg-danger/12 text-danger hover:bg-danger/20',
  success:   'bg-success/12 text-success hover:bg-success/20',
  warning:   'bg-warning/12 text-warning hover:bg-warning/20',
}

export function ConfirmButton({
  children,
  onConfirm,
  confirmLabel = 'Click again to confirm',
  mode = 'doubleclick',
  holdDuration = 800,
  intent = 'danger',
  variant = 'solid',
  resetDelay = 2000,
  className,
  style,
  ...rest
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdStart = useRef<number | null>(null)

  const clearReset = () => { if (resetTimer.current) clearTimeout(resetTimer.current) }

  const scheduleReset = useCallback(() => {
    clearReset()
    resetTimer.current = setTimeout(() => setConfirming(false), resetDelay)
  }, [resetDelay])

  const handleClick = useCallback(() => {
    if (mode !== 'doubleclick') return
    if (!confirming) { setConfirming(true); scheduleReset() }
    else { clearReset(); setConfirming(false); onConfirm() }
  }, [mode, confirming, scheduleReset, onConfirm])

  const handleMouseDown = useCallback(() => {
    if (mode !== 'hold') return
    holdStart.current = performance.now()
    const tick = () => {
      if (holdStart.current === null) return
      const elapsed = performance.now() - holdStart.current
      const progress = Math.min(elapsed / holdDuration, 1)
      setHoldProgress(progress)
      if (progress < 1) { rafRef.current = requestAnimationFrame(tick) }
      else { holdStart.current = null; setHoldProgress(0); onConfirm() }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [mode, holdDuration, onConfirm])

  const handleMouseUp = useCallback(() => {
    if (mode !== 'hold') return
    holdStart.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setHoldProgress(0)
  }, [mode])

  const label = mode === 'doubleclick' && confirming ? confirmLabel : children

  const variantCls = variant === 'solid'
    ? INTENT_CLASSES[intent]
    : variant === 'outline'
    ? cn('border', INTENT_OUTLINE[intent])
    : INTENT_SOFT[intent]

  return (
    <button
      {...rest}
      className={cn(
        'relative overflow-hidden px-4 py-2 rounded-[--radius-sm] text-body-callout font-medium',
        'transition-all duration-200 cursor-pointer select-none',
        variantCls,
        confirming && 'ring-2 ring-current ring-offset-1',
        className
      )}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {label}
      {mode === 'hold' && holdProgress > 0 && (
        <span
          className="absolute inset-y-0 left-0 bg-white/20 pointer-events-none transition-none"
          style={{ width: `${holdProgress * 100}%` }}
        />
      )}
    </button>
  )
}
