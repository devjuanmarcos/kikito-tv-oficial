'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { BannerProps } from './banner.types'

const defaultIcons: Record<string, React.ReactNode> = {
  info:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  success: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  danger:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  neutral: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
}

const XIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const INTENT_CLS: Record<string, string> = {
  info:    'bg-[color-mix(in_oklch,var(--ks-info)_10%,transparent)] border-[color-mix(in_oklch,var(--ks-info)_25%,transparent)] text-[--ks-info]',
  success: 'bg-[color-mix(in_oklch,var(--ks-success)_10%,transparent)] border-[color-mix(in_oklch,var(--ks-success)_25%,transparent)] text-[--ks-success]',
  warning: 'bg-[color-mix(in_oklch,var(--ks-warning)_12%,transparent)] border-[color-mix(in_oklch,var(--ks-warning)_30%,transparent)] text-[--ks-warning]',
  danger:  'bg-[color-mix(in_oklch,var(--ks-danger)_10%,transparent)] border-[color-mix(in_oklch,var(--ks-danger)_25%,transparent)] text-[--ks-danger]',
  neutral: 'bg-[color-mix(in_oklch,var(--ks-text-muted)_10%,transparent)] border-rule text-muted',
}

export function Banner({
  children,
  intent      = 'info',
  dismissible = false,
  onDismiss,
  icon,
  action,
  className,
  style,
}: BannerProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const resolvedIcon = icon !== undefined ? icon : defaultIcons[intent]

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-[0.625rem] text-[0.8125rem] rounded-[--radius-base] border',
        INTENT_CLS[intent],
        className,
      )}
      style={style}
      role="alert"
    >
      {resolvedIcon && (
        <span className="flex items-center justify-center w-4 h-4 shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {resolvedIcon}
        </span>
      )}
      <div className="flex-1 text-foreground">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="flex items-center justify-center w-5 h-5 border-none bg-transparent cursor-pointer text-current opacity-50 rounded p-0 shrink-0 [&>svg]:w-full [&>svg]:h-full hover:opacity-100"
          onClick={() => { setVisible(false); onDismiss?.() }}
          aria-label="Dismiss"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
