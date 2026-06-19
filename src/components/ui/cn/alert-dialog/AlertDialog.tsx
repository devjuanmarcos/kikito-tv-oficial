'use client'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import type { AlertDialogProps } from './alert-dialog.types'

const DangerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const PrimaryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const ICON_CLS: Record<string, string> = {
  danger:  'bg-[color-mix(in_srgb,var(--ks-danger)_12%,transparent)] text-danger',
  warning: 'bg-[color-mix(in_srgb,var(--ks-warning)_12%,transparent)] text-warning',
  primary: 'bg-[color-mix(in_srgb,var(--ks-patina)_12%,transparent)] text-patina',
}

const CONFIRM_CLS: Record<string, string> = {
  danger:  'bg-danger text-[var(--ks-danger-fg,#fff)]',
  warning: 'bg-warning text-[var(--ks-warning-fg,#000)]',
  primary: 'bg-patina text-patina-fg',
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  onConfirm,
  onCancel,
  intent  = 'danger',
  loading = false,
  className,
  style,
}: AlertDialogProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  const handleCancel = () => { onCancel?.(); onOpenChange(false) }

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <style>{`
        .ad-overlay { transition: opacity 0.16s; }
        .ad-overlay[data-open="false"] { opacity: 0; pointer-events: none; }
        .ad-panel { transition: opacity 0.16s, transform 0.2s cubic-bezier(0.4,0,0.2,1); }
        .ad-panel[data-open="false"] { opacity: 0; transform: scale(0.92) translateY(-16px); pointer-events: none; }
      `}</style>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.55)] flex items-center justify-center z-[9999] p-4 ad-overlay"
        data-open={String(open)}
        onClick={e => { if (e.target === e.currentTarget) handleCancel() }}
      >
        <div
          className={cn(
            'bg-raised border border-rule rounded-[12px] p-6 w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] ad-panel',
            className,
          )}
          style={style}
          data-open={String(open)}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="ad-title"
          aria-describedby={description ? 'ad-desc' : undefined}
        >
          <div className={cn('w-10 h-10 rounded-md flex items-center justify-center mb-4 [&>svg]:w-5 [&>svg]:h-5', ICON_CLS[intent])}>
            {intent === 'primary' ? <PrimaryIcon /> : <DangerIcon />}
          </div>
          <p className="text-base font-bold mb-2 text-foreground" id="ad-title">{title}</p>
          {description && (
            <p className="text-[0.875rem] leading-relaxed text-muted mb-6" id="ad-desc">{description}</p>
          )}
          <div className="flex gap-2 justify-end">
            <button
              className="px-4 py-2 rounded-[--radius] border border-rule bg-transparent text-foreground text-[0.875rem] font-medium cursor-pointer transition-[background] duration-[150ms] hover:bg-graphite disabled:opacity-50 disabled:cursor-not-allowed font-[inherit]"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-[--radius] border-none text-[0.875rem] font-semibold cursor-pointer flex items-center gap-[6px] transition-opacity duration-[150ms] hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed font-[inherit]',
                CONFIRM_CLS[intent],
              )}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-[color-mix(in_oklch,currentColor_30%,transparent)] border-t-current rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
