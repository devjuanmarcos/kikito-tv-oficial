'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type FloatingBarPosition = 'bottom' | 'top'

export interface FloatingBarProps {
  children:   React.ReactNode
  position?:  FloatingBarPosition
  visible?:   boolean
  onDismiss?: () => void
  className?: string
  style?:     React.CSSProperties
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
  </svg>
)

export function FloatingBar({
  children,
  position  = 'bottom',
  visible   = true,
  onDismiss,
  className,
  style,
}: FloatingBarProps) {
  return (
    <div
      style={style}
      className={cn(
        'fixed z-[850] left-1/2 -translate-x-1/2 transition-[opacity,transform] duration-[200ms] ease-in-out',
        position === 'bottom' ? 'bottom-6' : 'top-6',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : position === 'bottom'
            ? 'opacity-0 translate-y-4 pointer-events-none'
            : 'opacity-0 -translate-y-4 pointer-events-none',
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-raised border border-rule shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.5)]">
        {children}
        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="ml-1 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded text-faint hover:text-foreground hover:bg-graphite transition-colors duration-[80ms]"
          >
            <XIcon />
          </button>
        )}
      </div>
    </div>
  )
}
