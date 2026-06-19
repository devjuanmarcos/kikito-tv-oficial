'use client'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { DrawerProps, DrawerSide, DrawerSize } from './drawer.types'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const SIDE_CLS: Record<DrawerSide, string> = {
  right:  'top-0 right-0 bottom-0 border-l border-rule shadow-[-8px_0_40px_-8px_oklch(0%_0_0/0.40)]',
  left:   'top-0 left-0 bottom-0 border-r border-rule shadow-[8px_0_40px_-8px_oklch(0%_0_0/0.40)]',
  bottom: 'left-0 right-0 bottom-0 border-t border-rule rounded-t-[14px] shadow-[0_-8px_40px_-8px_oklch(0%_0_0/0.40)]',
  top:    'left-0 right-0 top-0 border-b border-rule rounded-b-[14px] shadow-[0_8px_40px_-8px_oklch(0%_0_0/0.40)]',
}

const SLIDE_IN: Record<DrawerSide, string>  = {
  right: 'translate-x-full',  left: '-translate-x-full',
  bottom: 'translate-y-full', top: '-translate-y-full',
}

const HORIZONTAL_SIZE: Record<DrawerSize, string> = { sm: 'w-80', md: 'w-[420px]', lg: 'w-[560px]', xl: 'w-[720px]' }
const VERTICAL_SIZE: Record<DrawerSize, string>   = { sm: 'max-h-[30vh]', md: 'max-h-[50vh]', lg: 'max-h-[70vh]', xl: 'max-h-[90vh]' }

function drawerSizeCls(side: DrawerSide, size: DrawerSize) {
  return (side === 'left' || side === 'right') ? HORIZONTAL_SIZE[size] : VERTICAL_SIZE[size]
}

const FOOTER_ALIGN = { right: 'justify-end', left: 'justify-start', center: 'justify-center', between: 'justify-between' }

export function Drawer({
  open,
  onClose,
  side           = 'right',
  size           = 'md',
  title,
  description,
  hideClose      = false,
  closeOnOverlay = true,
  closeOnEscape  = true,
  footer,
  footerAlign    = 'right',
  className,
  children,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const el = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    el?.focus()
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, closeOnEscape, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <style>{`
        .dr-overlay { transition: opacity 0.18s; }
        .dr-overlay[data-open="false"] { opacity: 0; pointer-events: none; }
        .dr-panel { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
      <div>
        <div
          className="fixed inset-0 bg-[oklch(0%_0_0/0.55)] z-[1100] dr-overlay"
          data-open={String(open)}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={cn(
            'fixed z-[1101] bg-base flex flex-col outline-none overflow-hidden dr-panel',
            'transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
            SIDE_CLS[side],
            drawerSizeCls(side, size),
            !open && SLIDE_IN[side],
            className,
          )}
        >
          {(title || !hideClose) && (
            <div className="flex items-start gap-3 px-6 py-5 border-b border-rule shrink-0">
              <div className="flex-1 min-w-0">
                {title       && <p className="text-base font-bold text-foreground">{title}</p>}
                {description && <p className="text-[0.8125rem] text-faint mt-1 leading-[1.45]">{description}</p>}
              </div>
              {!hideClose && (
                <button
                  type="button"
                  className="inline-flex bg-transparent border-none cursor-pointer p-1 rounded-sm text-faint shrink-0 transition-[color,background] duration-[120ms] hover:text-foreground hover:bg-graphite-2 [&>svg]:w-[1.125rem] [&>svg]:h-[1.125rem]"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <XIcon />
                </button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          {footer && (
            <div className={cn('flex items-center gap-[0.625rem] px-6 py-4 border-t border-rule shrink-0', FOOTER_ALIGN[footerAlign])}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
