'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { BadgeProps, BadgeVariant, BadgeSize, BadgeIntent } from './badge.types'

const SIZE: Record<BadgeSize, string> = {
  sm: 'h-4   px-1.5 gap-1   text-[0.625rem] leading-none rounded-[--radius-xs]',
  md: 'h-5   px-2   gap-1   text-body-caption rounded-[--radius-xs]',
  lg: 'h-6   px-2.5 gap-1.5 text-body-callout rounded-[--radius-sm]',
}

const DOT_SIZE: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2   h-2',
  lg: 'w-2   h-2',
}

type IntentVariantKey = `${BadgeIntent}/${BadgeVariant}`

const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  /* primary */
  'primary/solid':   'bg-patina text-patina-fg border-transparent',
  'primary/outline': 'bg-transparent text-patina border-patina',
  'primary/soft':    'bg-patina-soft text-patina border-transparent',
  'primary/dot':     'bg-patina-soft text-patina border-transparent',

  /* secondary */
  'secondary/solid':   'bg-kinpaku text-kinpaku-fg border-transparent',
  'secondary/outline': 'bg-transparent text-kinpaku border-kinpaku',
  'secondary/soft':    'bg-kinpaku-soft text-kinpaku-soft-fg border-transparent',
  'secondary/dot':     'bg-kinpaku-soft text-kinpaku-soft-fg border-transparent',

  /* danger */
  'danger/solid':   'bg-danger text-danger-fg border-transparent',
  'danger/outline': 'bg-transparent text-danger border-danger',
  'danger/soft':    'bg-danger-soft text-danger-soft-fg border-transparent',
  'danger/dot':     'bg-danger-soft text-danger-soft-fg border-transparent',

  /* success */
  'success/solid':   'bg-success text-success-fg border-transparent',
  'success/outline': 'bg-transparent text-success border-success',
  'success/soft':    'bg-success-soft text-success-soft-fg border-transparent',
  'success/dot':     'bg-success-soft text-success-soft-fg border-transparent',

  /* warning */
  'warning/solid':   'bg-warning text-warning-fg border-transparent',
  'warning/outline': 'bg-transparent text-warning border-warning',
  'warning/soft':    'bg-warning-soft text-warning-soft-fg border-transparent',
  'warning/dot':     'bg-warning-soft text-warning-soft-fg border-transparent',

  /* info */
  'info/solid':   'bg-info text-info-fg border-transparent',
  'info/outline': 'bg-transparent text-info border-info',
  'info/soft':    'bg-info-soft text-info-soft-fg border-transparent',
  'info/dot':     'bg-info-soft text-info-soft-fg border-transparent',

  /* neutral */
  'neutral/solid':   'bg-neutral text-neutral-fg border-transparent',
  'neutral/outline': 'bg-transparent text-foreground border-rule',
  'neutral/soft':    'bg-graphite text-foreground border-transparent',
  'neutral/dot':     'bg-graphite text-foreground border-transparent',
}

const DOT_COLOR: Record<BadgeIntent, string> = {
  primary:   'bg-patina',
  secondary: 'bg-kinpaku',
  danger:    'bg-danger',
  success:   'bg-success',
  warning:   'bg-warning',
  info:      'bg-info',
  neutral:   'bg-foreground',
}

export function Badge({
  variant  = 'soft',
  size     = 'md',
  intent   = 'primary',
  dot,
  iconLeft,
  iconRight,
  onDismiss,
  className,
  children,
  ...props
}: BadgeProps) {
  const key = `${intent}/${variant}` as IntentVariantKey
  const intentCls = INTENT_VARIANT[key] ?? INTENT_VARIANT['neutral/soft']
  const showDot = dot || variant === 'dot'

  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center font-medium border select-none whitespace-nowrap',
        SIZE[size],
        intentCls,
        className,
      )}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={cn('shrink-0 rounded-full', DOT_SIZE[size], DOT_COLOR[intent])}
        />
      )}

      {!showDot && iconLeft && (
        <span aria-hidden="true" className="shrink-0 w-3 h-3 flex items-center justify-center">
          {iconLeft}
        </span>
      )}

      {children}

      {!showDot && iconRight && (
        <span aria-hidden="true" className="shrink-0 w-3 h-3 flex items-center justify-center">
          {iconRight}
        </span>
      )}

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="shrink-0 ml-0.5 -mr-0.5 w-3 h-3 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-patina"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  )
}

Badge.displayName = 'Badge'
