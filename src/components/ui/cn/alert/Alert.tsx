'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type AlertIntent    = 'info' | 'success' | 'warning' | 'danger' | 'neutral'
export type AlertVariant   = 'soft' | 'outline' | 'solid' | 'left-accent'
export type AlertSize      = 'sm' | 'md' | 'lg'

export interface AlertProps {
  intent?:     AlertIntent
  variant?:    AlertVariant
  title?:      string
  children?:   React.ReactNode
  icon?:       React.ReactNode
  showIcon?:   boolean
  dismissible?: boolean
  onDismiss?:  () => void
  actions?:    React.ReactNode
  size?:       AlertSize
  className?:  string
  style?:      React.CSSProperties
}

/* ── default icons ── */
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
)
const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const DangerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)
const NeutralIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const DEFAULT_ICON: Record<AlertIntent, React.ReactNode> = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger:  <DangerIcon />,
  neutral: <NeutralIcon />,
}

/* ── color maps ── */
const SOFT_CLS: Record<AlertIntent, string> = {
  info:    'bg-[color-mix(in_oklch,var(--ks-info)_10%,transparent)] text-foreground [--alert-ic:var(--ks-info)]',
  success: 'bg-[color-mix(in_oklch,var(--ks-success)_10%,transparent)] text-foreground [--alert-ic:var(--ks-success)]',
  warning: 'bg-[color-mix(in_oklch,var(--ks-warning)_12%,transparent)] text-foreground [--alert-ic:var(--ks-warning)]',
  danger:  'bg-[color-mix(in_oklch,var(--ks-danger)_10%,transparent)] text-foreground [--alert-ic:var(--ks-danger)]',
  neutral: 'bg-graphite text-foreground [--alert-ic:var(--ks-text-faint)]',
}
const OUTLINE_CLS: Record<AlertIntent, string> = {
  info:    'border border-[color-mix(in_oklch,var(--ks-info)_40%,transparent)] text-foreground [--alert-ic:var(--ks-info)]',
  success: 'border border-[color-mix(in_oklch,var(--ks-success)_40%,transparent)] text-foreground [--alert-ic:var(--ks-success)]',
  warning: 'border border-[color-mix(in_oklch,var(--ks-warning)_40%,transparent)] text-foreground [--alert-ic:var(--ks-warning)]',
  danger:  'border border-[color-mix(in_oklch,var(--ks-danger)_40%,transparent)] text-foreground [--alert-ic:var(--ks-danger)]',
  neutral: 'border border-rule text-foreground [--alert-ic:var(--ks-text-faint)]',
}
const SOLID_CLS: Record<AlertIntent, string> = {
  info:    'bg-info text-white [--alert-ic:white]',
  success: 'bg-success text-white [--alert-ic:white]',
  warning: 'bg-warning text-black [--alert-ic:black]',
  danger:  'bg-danger text-white [--alert-ic:white]',
  neutral: 'bg-graphite-2 text-foreground [--alert-ic:var(--ks-text-faint)]',
}
const ACCENT_CLS: Record<AlertIntent, string> = {
  info:    'bg-[color-mix(in_oklch,var(--ks-info)_8%,transparent)] border-l-4 border-l-info text-foreground [--alert-ic:var(--ks-info)]',
  success: 'bg-[color-mix(in_oklch,var(--ks-success)_8%,transparent)] border-l-4 border-l-success text-foreground [--alert-ic:var(--ks-success)]',
  warning: 'bg-[color-mix(in_oklch,var(--ks-warning)_10%,transparent)] border-l-4 border-l-warning text-foreground [--alert-ic:var(--ks-warning)]',
  danger:  'bg-[color-mix(in_oklch,var(--ks-danger)_8%,transparent)] border-l-4 border-l-danger text-foreground [--alert-ic:var(--ks-danger)]',
  neutral: 'bg-graphite border-l-4 border-l-rule text-foreground [--alert-ic:var(--ks-text-faint)]',
}

const SIZE_CLS: Record<AlertSize, { root: string; icon: string; title: string; body: string }> = {
  sm: { root: 'gap-2 px-3 py-2 rounded-[--radius-sm]', icon: 'w-4 h-4',      title: 'text-body-callout', body: 'text-body-caption' },
  md: { root: 'gap-3 px-4 py-3 rounded-[--radius-sm]', icon: 'w-[1.125rem] h-[1.125rem]', title: 'text-body-paragraph', body: 'text-body-callout' },
  lg: { root: 'gap-4 px-5 py-4 rounded-[--radius-md]', icon: 'w-5 h-5',      title: 'text-[1.0625rem]', body: 'text-body-paragraph' },
}

export function Alert({
  intent    = 'info',
  variant   = 'soft',
  title,
  children,
  icon,
  showIcon  = true,
  dismissible,
  onDismiss,
  actions,
  size      = 'md',
  className,
  style,
}: AlertProps) {
  const variantCls =
    variant === 'outline'      ? OUTLINE_CLS[intent] :
    variant === 'solid'        ? SOLID_CLS[intent]   :
    variant === 'left-accent'  ? ACCENT_CLS[intent]  :
    SOFT_CLS[intent]

  const sz = SIZE_CLS[size]
  const resolvedIcon = icon !== undefined ? icon : DEFAULT_ICON[intent]

  return (
    <div
      role="alert"
      className={cn('flex items-start', sz.root, variantCls, className)}
      style={style}
    >
      {showIcon && resolvedIcon && (
        <span className={cn('shrink-0 mt-[0.06rem] [&>svg]:w-full [&>svg]:h-full text-[--alert-ic]', sz.icon)}>
          {resolvedIcon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn('font-semibold leading-[1.3]', sz.title, children && 'mb-[0.25em]')}>{title}</p>
        )}
        {children && (
          <div className={cn('leading-[1.5]', sz.body, 'opacity-85')}>{children}</div>
        )}
        {actions && (
          <div className="flex flex-wrap gap-2 mt-3">{actions}</div>
        )}
      </div>
      {(dismissible || onDismiss) && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-0.5 -mt-0.5 -mr-0.5 rounded opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-current [&>svg]:w-[0.875rem] [&>svg]:h-[0.875rem]"
          aria-label="Dismiss"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
