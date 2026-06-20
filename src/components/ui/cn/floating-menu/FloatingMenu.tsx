'use client'
import type React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type FloatingMenuPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right'

export interface FloatingMenuItem {
  id:       string
  label:    string
  icon?:    React.ReactNode
  intent?:  'danger' | 'default'
  disabled?: boolean
  onClick?: () => void
}

export interface FloatingMenuProps {
  items:        FloatingMenuItem[]
  trigger:      React.ReactNode
  placement?:   FloatingMenuPlacement
  openOnHover?: boolean
  className?:   string
  style?:       React.CSSProperties
}

export function FloatingMenu({
  items,
  trigger,
  placement    = 'bottom-start',
  openOnHover  = false,
  className,
  style,
}: FloatingMenuProps) {
  const [open, setOpen]       = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos]         = useState({ top: 0, left: 0 })
  const wrapRef               = useRef<HTMLDivElement>(null)
  const menuRef               = useRef<HTMLDivElement>(null)
  const hoverTimer            = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => { setMounted(true) }, [])

  const calcPos = useCallback(() => {
    if (!wrapRef.current) return
    const r   = wrapRef.current.getBoundingClientRect()
    const mW  = 180
    const mH  = items.length * 40 + 16
    const vW  = window.innerWidth
    const vH  = window.innerHeight
    const gap = 6

    let top = r.bottom + gap
    let left = r.left

    if (placement.startsWith('top'))    { top = r.top - mH - gap }
    if (placement.startsWith('bottom')) { top = r.bottom + gap }
    if (placement === 'left')           { top = r.top; left = r.left - mW - gap }
    if (placement === 'right')          { top = r.top; left = r.right + gap }
    if (placement.endsWith('end'))      { left = r.right - mW }
    if (placement === 'top' || placement === 'bottom') { left = r.left + r.width / 2 - mW / 2 }

    left = Math.max(8, Math.min(left, vW - mW - 8))
    top  = Math.max(8, Math.min(top,  vH - mH - 8))
    setPos({ top, left })
  }, [placement, items.length])

  useEffect(() => {
    if (!open) return
    calcPos()
    const handleOutside = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node) || menuRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, calcPos])

  const hoverProps = openOnHover
    ? {
        onMouseEnter: () => { clearTimeout(hoverTimer.current); setOpen(true) },
        onMouseLeave: () => { hoverTimer.current = setTimeout(() => setOpen(false), 150) },
      }
    : {}

  return (
    <div ref={wrapRef} style={style} className={cn('relative inline-block', className)} {...hoverProps}>
      <div onClick={() => !openOnHover && setOpen(v => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          style={{ top: pos.top, left: pos.left, minWidth: 180 }}
          className="fixed z-[950] py-1.5 rounded-xl border border-rule bg-raised shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.5)]"
          {...(openOnHover ? {
            onMouseEnter: () => clearTimeout(hoverTimer.current),
            onMouseLeave: () => { hoverTimer.current = setTimeout(() => setOpen(false), 150) },
          } : {})}
        >
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => { item.onClick?.(); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-body-callout text-left',
                'transition-colors duration-[80ms] hover:bg-graphite',
                item.intent === 'danger' ? 'text-danger hover:text-danger' : 'text-foreground',
                item.disabled && 'opacity-40 pointer-events-none',
              )}
            >
              {item.icon && <span className="text-base leading-none">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}
