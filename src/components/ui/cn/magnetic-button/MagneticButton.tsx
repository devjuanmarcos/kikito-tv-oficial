'use client'

import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { MagneticButtonProps } from './magnetic-button.types'

export function MagneticButton({
  children,
  strength = 0.4,
  radius = 80,
  onClick,
  disabled = false,
  className,
  style,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = btnRef.current
    if (!el || disabled) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < radius) {
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
  }, [strength, radius, disabled])

  const onMouseLeave = useCallback(() => {
    if (btnRef.current)
      btnRef.current.style.transform = 'translate(0, 0)'
  }, [])

  return (
    <span
      className={cn('inline-flex', className)}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <button
        ref={btnRef}
        className="px-6 py-2.5 rounded-[--radius-sm] bg-patina text-patina-fg font-medium text-[0.875rem] cursor-pointer transition-transform duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
        onClick={onClick}
        style={{ transition: 'transform 0.15s cubic-bezier(0.2,0.8,0.4,1)' }}
      >
        {children}
      </button>
    </span>
  )
}
