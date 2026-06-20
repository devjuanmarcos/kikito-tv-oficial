'use client'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/cn/button'
import type { ButtonIntent } from '@/components/ui/cn/button'
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
        className="fixed inset-0 bg-black/55 flex items-center justify-center z-[9999] p-4 ad-overlay"
        data-open={String(open)}
        onClick={e => { if (e.target === e.currentTarget) handleCancel() }}
      >
        <div
          className={cn(
            'bg-raised border border-rule rounded-[12px] p-6 w-full max-w-[440px] shadow-[0_20px_60px_color-mix(in_srgb,black_35%,transparent)] ad-panel',
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
          <p className="text-body-paragraph font-bold mb-2 text-foreground" id="ad-title">{title}</p>
          {description && (
            <p className="text-body-callout leading-relaxed text-muted mb-6" id="ad-desc">{description}</p>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              intent="neutral"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              intent={intent as ButtonIntent}
              variant="solid"
              size="sm"
              loading={loading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
