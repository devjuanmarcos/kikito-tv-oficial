'use client'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  open:           boolean
  onClose:        () => void
  title?:         string
  description?:   string
  children?:      React.ReactNode
  size?:          ModalSize
  closeOnOverlay?: boolean
  closeOnEscape?:  boolean
  hideClose?:      boolean
  className?:      string
}

export interface ModalBodyProps {
  children?:  React.ReactNode
  className?: string
}

export interface ModalFooterProps {
  children?:  React.ReactNode
  align?:     'left' | 'right' | 'center' | 'between'
  className?: string
}

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'

const SIZE_CLS: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
}
const FOOTER_ALIGN: Record<NonNullable<ModalFooterProps['align']>, string> = {
  left:    'justify-start',
  right:   'justify-end',
  center:  'justify-center',
  between: 'justify-between',
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size           = 'md',
  closeOnOverlay = true,
  closeOnEscape  = true,
  hideClose      = false,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const el = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    el?.focus()
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); onClose() } }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, closeOnEscape, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <style>{`
        .ks-modal-overlay { transition: opacity 0.18s; }
        .ks-modal-overlay[data-open="false"] { opacity: 0; pointer-events: none; }
        .ks-modal-panel { transition: opacity 0.22s, transform 0.22s cubic-bezier(0.4,0,0.2,1); }
        .ks-modal-panel[data-open="false"] { opacity: 0; transform: scale(0.96) translateY(8px); pointer-events: none; }
      `}</style>
      <div>
        <div
          className="fixed inset-0 bg-black/55 z-[1200] ks-modal-overlay"
          data-open={String(open)}
          onClick={closeOnOverlay ? onClose : undefined}
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-[1201] flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            data-open={String(open)}
            className={cn(
              'pointer-events-auto bg-base border border-rule rounded-[--radius-md] shadow-[0_20px_60px_-16px_oklch(0%_0_0/0.55)] flex flex-col w-full outline-none ks-modal-panel',
              SIZE_CLS[size],
              size === 'full' && 'overflow-hidden',
              className,
            )}
          >
            {(title || description || !hideClose) && (
              <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-rule shrink-0">
                <div className="flex-1 min-w-0">
                  {title       && <p className="text-body-paragraph font-bold text-foreground">{title}</p>}
                  {description && <p className="text-body-callout text-faint mt-1 leading-[1.45]">{description}</p>}
                </div>
                {!hideClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 inline-flex bg-transparent border-none cursor-pointer p-1 rounded-sm text-faint hover:text-foreground hover:bg-graphite-2 transition-[color,background] duration-[120ms] [&>svg]:w-[1.125rem] [&>svg]:h-[1.125rem]"
                    aria-label="Close"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-5', className)}>
      {children}
    </div>
  )
}

export function ModalFooter({ children, align = 'right', className }: ModalFooterProps) {
  return (
    <div className={cn('flex items-center gap-[0.625rem] px-6 py-4 border-t border-rule shrink-0', FOOTER_ALIGN[align], className)}>
      {children}
    </div>
  )
}
