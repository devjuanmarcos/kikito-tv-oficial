'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface CollapsibleProps {
  title:          React.ReactNode
  children:       React.ReactNode
  open?:          boolean
  defaultOpen?:   boolean
  onOpenChange?:  (open: boolean) => void
  disabled?:      boolean
  className?:     string
  style?:         React.CSSProperties
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
    className={cn('w-4 h-4 shrink-0 text-faint transition-transform duration-[200ms]', open && 'rotate-180')}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

export function Collapsible({
  title,
  children,
  open: openProp,
  defaultOpen  = false,
  onOpenChange,
  disabled     = false,
  className,
  style,
}: CollapsibleProps) {
  const isControlled = openProp !== undefined
  const [internal, setInternal] = useState(defaultOpen)
  const open = isControlled ? openProp : internal

  function toggle() {
    if (disabled) return
    const next = !open
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }

  return (
    <div style={style} className={cn('rounded-[--radius-md] border border-rule overflow-hidden', className)}>
      <button
        type="button"
        aria-expanded={open}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-body-callout font-medium text-foreground',
          'bg-raised hover:bg-graphite transition-colors duration-[80ms] select-none',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span>{title}</span>
        <ChevronIcon open={open} />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-[250ms] ease-in-out',
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!open}
      >
        <div className="px-4 py-3 text-body-callout text-foreground/80 leading-[1.6] border-t border-rule bg-raised">
          {children}
        </div>
      </div>
    </div>
  )
}
