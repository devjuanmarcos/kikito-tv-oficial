'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps, ButtonVariant, ButtonSize, ButtonIntent } from './button.types'

/* ── Size scale (font uses body-callout / body-paragraph token scale) ── */
const SIZE: Record<ButtonSize, string> = {
  xs: 'h-6  px-2   gap-1   text-body-caption  rounded-[--radius-sm]',
  sm: 'h-8  px-3   gap-1.5 text-body-callout  rounded-[--radius-sm]',
  md: 'h-9  px-4   gap-2   text-body-callout  rounded-[--radius-base]',
  lg: 'h-11 px-5   gap-2   text-body-paragraph rounded-[--radius-md]',
  xl: 'h-14 px-6   gap-2.5 text-body-paragraph rounded-[--radius-lg]',
}

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
}

/* ── Intent × Variant matrix — all colors via --ks-* tokens ── */
type IntentVariantKey = `${ButtonIntent}/${ButtonVariant}`

const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  /* primary */
  'primary/solid':   'bg-patina text-patina-fg hover:bg-patina-hover border-transparent',
  'primary/outline': 'bg-transparent text-patina border-patina hover:bg-patina-soft hover:text-patina-soft-fg',
  'primary/ghost':   'bg-transparent text-patina border-transparent hover:bg-patina-soft',
  'primary/soft':    'bg-patina-soft text-patina-soft-fg border-transparent hover:bg-patina-soft/80',

  /* secondary */
  'secondary/solid':   'bg-kinpaku text-kinpaku-fg hover:bg-kinpaku-hover border-transparent',
  'secondary/outline': 'bg-transparent text-kinpaku border-kinpaku hover:bg-kinpaku-soft',
  'secondary/ghost':   'bg-transparent text-kinpaku border-transparent hover:bg-kinpaku-soft',
  'secondary/soft':    'bg-kinpaku-soft text-kinpaku-soft-fg border-transparent hover:bg-kinpaku-soft/80',

  /* danger */
  'danger/solid':   'bg-danger text-danger-fg hover:bg-danger-hover border-transparent',
  'danger/outline': 'bg-transparent text-danger border-danger hover:bg-danger-soft',
  'danger/ghost':   'bg-transparent text-danger border-transparent hover:bg-danger-soft',
  'danger/soft':    'bg-danger-soft text-danger-soft-fg border-transparent hover:bg-danger-soft/80',

  /* success */
  'success/solid':   'bg-success text-success-fg hover:bg-success-hover border-transparent',
  'success/outline': 'bg-transparent text-success border-success hover:bg-success-soft',
  'success/ghost':   'bg-transparent text-success border-transparent hover:bg-success-soft',
  'success/soft':    'bg-success-soft text-success-soft-fg border-transparent hover:bg-success-soft/80',

  /* warning */
  'warning/solid':   'bg-warning text-warning-fg hover:bg-warning-hover border-transparent',
  'warning/outline': 'bg-transparent text-warning border-warning hover:bg-warning-soft',
  'warning/ghost':   'bg-transparent text-warning border-transparent hover:bg-warning-soft',
  'warning/soft':    'bg-warning-soft text-warning-soft-fg border-transparent hover:bg-warning-soft/80',

  /* info */
  'info/solid':   'bg-info text-info-fg hover:bg-info-hover border-transparent',
  'info/outline': 'bg-transparent text-info border-info hover:bg-info-soft',
  'info/ghost':   'bg-transparent text-info border-transparent hover:bg-info-soft',
  'info/soft':    'bg-info-soft text-info-soft-fg border-transparent hover:bg-info-soft/80',

  /* neutral */
  'neutral/solid':   'bg-neutral text-neutral-fg hover:bg-neutral-hover border-transparent',
  'neutral/outline': 'bg-transparent text-foreground border-rule hover:bg-raised',
  'neutral/ghost':   'bg-transparent text-muted border-transparent hover:bg-raised hover:text-foreground',
  'neutral/soft':    'bg-raised text-foreground border-rule hover:bg-graphite',
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={cn('animate-spin-icon', className)}
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

export function Button({
  variant  = 'solid',
  size     = 'md',
  intent   = 'primary',
  loading  = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const key = `${intent}/${variant}` as IntentVariantKey
  const intentCls = INTENT_VARIANT[key] ?? INTENT_VARIANT['neutral/solid']

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={(disabled || loading) || undefined}
      className={cn(
        /* base */
        'inline-flex items-center justify-center font-medium border',
        'transition-colors duration-150 select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina',
        'disabled:opacity-50 disabled:pointer-events-none',
        /* size */
        SIZE[size],
        /* intent × variant */
        intentCls,
        /* full width */
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <SpinnerIcon className={ICON_SIZE[size]} />
      ) : iconLeft ? (
        <span aria-hidden="true" className={cn('shrink-0', ICON_SIZE[size])}>
          {iconLeft}
        </span>
      ) : null}

      {children && <span className="truncate">{children}</span>}

      {!loading && iconRight && (
        <span aria-hidden="true" className={cn('shrink-0', ICON_SIZE[size])}>
          {iconRight}
        </span>
      )}
    </button>
  )
}

Button.displayName = 'Button'
