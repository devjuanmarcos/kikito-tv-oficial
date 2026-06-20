'use client'

import React, { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  ButtonIntent,
  ButtonStatus,
  ButtonRounded,
} from './button.types'

/* ── Size scale ── */
const SIZE: Record<ButtonSize, string> = {
  xs: 'h-6  px-2   gap-1   text-body-caption',
  sm: 'h-8  px-3   gap-1.5 text-body-callout',
  md: 'h-9  px-4   gap-2   text-body-callout',
  lg: 'h-11 px-5   gap-2   text-body-paragraph',
  xl: 'h-14 px-6   gap-2.5 text-body-paragraph',
}

const SIZE_ICON_ONLY: Record<ButtonSize, string> = {
  xs: 'h-6  w-6',
  sm: 'h-8  w-8',
  md: 'h-9  w-9',
  lg: 'h-11 w-11',
  xl: 'h-14 w-14',
}

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: 'w-3   h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4   h-4',
  lg: 'w-4   h-4',
  xl: 'w-5   h-5',
}

/* Default radius per size (overridable by `rounded` prop) */
const SIZE_RADIUS: Record<ButtonSize, string> = {
  xs: 'rounded-[--radius-sm]',
  sm: 'rounded-[--radius-sm]',
  md: 'rounded-[--radius-base]',
  lg: 'rounded-[--radius-md]',
  xl: 'rounded-[--radius-lg]',
}

const ROUNDED_MAP: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm:   'rounded-[--radius-sm]',
  md:   'rounded-[--radius-base]',
  lg:   'rounded-[--radius-md]',
  xl:   'rounded-[--radius-lg]',
  '2xl':'rounded-[--radius-xl]',
  full: 'rounded-full',
}

/* ── Intent × Variant matrix ── */
type IntentVariantKey = `${ButtonIntent}/${ButtonVariant}`

const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  /* primary */
  'primary/solid':   'bg-patina text-patina-fg hover:bg-patina-hover border-transparent',
  'primary/outline': 'bg-transparent text-patina border-patina hover:bg-patina-soft hover:text-patina-soft-fg',
  'primary/ghost':   'bg-transparent text-patina border-transparent hover:bg-patina-soft',
  'primary/soft':    'bg-patina-soft text-patina-soft-fg border-transparent hover:bg-patina-soft/80',
  'primary/dashed':  'bg-transparent text-patina border-patina border-dashed hover:bg-patina-soft',
  'primary/link':    'bg-transparent text-patina border-transparent underline-offset-4 hover:underline px-0 h-auto',

  /* secondary */
  'secondary/solid':   'bg-kinpaku text-kinpaku-fg hover:bg-kinpaku-hover border-transparent',
  'secondary/outline': 'bg-transparent text-kinpaku border-kinpaku hover:bg-kinpaku-soft',
  'secondary/ghost':   'bg-transparent text-kinpaku border-transparent hover:bg-kinpaku-soft',
  'secondary/soft':    'bg-kinpaku-soft text-kinpaku-soft-fg border-transparent hover:bg-kinpaku-soft/80',
  'secondary/dashed':  'bg-transparent text-kinpaku border-kinpaku border-dashed hover:bg-kinpaku-soft',
  'secondary/link':    'bg-transparent text-kinpaku border-transparent underline-offset-4 hover:underline px-0 h-auto',

  /* danger */
  'danger/solid':   'bg-danger text-danger-fg hover:bg-danger-hover border-transparent',
  'danger/outline': 'bg-transparent text-danger border-danger hover:bg-danger-soft',
  'danger/ghost':   'bg-transparent text-danger border-transparent hover:bg-danger-soft',
  'danger/soft':    'bg-danger-soft text-danger-soft-fg border-transparent hover:bg-danger-soft/80',
  'danger/dashed':  'bg-transparent text-danger border-danger border-dashed hover:bg-danger-soft',
  'danger/link':    'bg-transparent text-danger border-transparent underline-offset-4 hover:underline px-0 h-auto',

  /* success */
  'success/solid':   'bg-success text-success-fg hover:bg-success-hover border-transparent',
  'success/outline': 'bg-transparent text-success border-success hover:bg-success-soft',
  'success/ghost':   'bg-transparent text-success border-transparent hover:bg-success-soft',
  'success/soft':    'bg-success-soft text-success-soft-fg border-transparent hover:bg-success-soft/80',
  'success/dashed':  'bg-transparent text-success border-success border-dashed hover:bg-success-soft',
  'success/link':    'bg-transparent text-success border-transparent underline-offset-4 hover:underline px-0 h-auto',

  /* warning */
  'warning/solid':   'bg-warning text-warning-fg hover:bg-warning-hover border-transparent',
  'warning/outline': 'bg-transparent text-warning border-warning hover:bg-warning-soft',
  'warning/ghost':   'bg-transparent text-warning border-transparent hover:bg-warning-soft',
  'warning/soft':    'bg-warning-soft text-warning-soft-fg border-transparent hover:bg-warning-soft/80',
  'warning/dashed':  'bg-transparent text-warning border-warning border-dashed hover:bg-warning-soft',
  'warning/link':    'bg-transparent text-warning border-transparent underline-offset-4 hover:underline px-0 h-auto',

  /* info */
  'info/solid':   'bg-info text-info-fg hover:bg-info-hover border-transparent',
  'info/outline': 'bg-transparent text-info border-info hover:bg-info-soft',
  'info/ghost':   'bg-transparent text-info border-transparent hover:bg-info-soft',
  'info/soft':    'bg-info-soft text-info-soft-fg border-transparent hover:bg-info-soft/80',
  'info/dashed':  'bg-transparent text-info border-info border-dashed hover:bg-info-soft',
  'info/link':    'bg-transparent text-info border-transparent underline-offset-4 hover:underline px-0 h-auto',

  /* neutral */
  'neutral/solid':   'bg-neutral text-neutral-fg hover:bg-neutral-hover border-transparent',
  'neutral/outline': 'bg-transparent text-foreground border-rule hover:bg-raised',
  'neutral/ghost':   'bg-transparent text-muted border-transparent hover:bg-raised hover:text-foreground',
  'neutral/soft':    'bg-raised text-foreground border-rule hover:bg-graphite',
  'neutral/dashed':  'bg-transparent text-muted border-rule border-dashed hover:bg-raised hover:text-foreground',
  'neutral/link':    'bg-transparent text-muted border-transparent underline-offset-4 hover:underline hover:text-foreground px-0 h-auto',
}

/* ── Icons ── */
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" className={cn('animate-spin-icon', className)}>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant          = 'solid',
  size             = 'md',
  intent           = 'primary',
  loading          = false,
  status: statusProp,
  successText,
  errorText,
  loadingText,
  loadingPosition  = 'replace',
  iconLeft,
  iconRight,
  iconOnly         = false,
  fullWidth        = false,
  rounded,
  disabled,
  className,
  children,
  onClick,
  as: Root         = 'button',
  ...props
}: ButtonProps, ref) {
  const [internalStatus, setInternalStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Controlled takes precedence; otherwise use internal async-managed state */
  const status = statusProp ?? internalStatus
  const isLoading = loading || status === 'loading'
  const isSuccess = status === 'success'
  const isError   = status === 'error'
  const isActive  = isLoading || isSuccess || isError

  /* Wrap onClick to auto-manage success/error state from async handlers */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick || statusProp !== undefined) {
        ;(onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e)
        return
      }
      const result = (onClick as (e: React.MouseEvent<HTMLButtonElement>) => unknown)(e)
      if (result instanceof Promise) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setInternalStatus('loading')
        result
          .then(() => {
            setInternalStatus('success')
            timeoutRef.current = setTimeout(() => setInternalStatus('idle'), 2000)
          })
          .catch(() => {
            setInternalStatus('error')
            timeoutRef.current = setTimeout(() => setInternalStatus('idle'), 2000)
          })
      }
    },
    [onClick, statusProp],
  )

  const key = `${intent}/${variant}` as IntentVariantKey
  const intentCls = INTENT_VARIANT[key] ?? INTENT_VARIANT['neutral/solid']
  const radiusCls = rounded ? ROUNDED_MAP[rounded] : SIZE_RADIUS[size]

  /* Leading slot content */
  const leadingIcon = isLoading
    ? (loadingPosition !== 'replace' ? <SpinnerIcon className={ICON_SIZE[size]} /> : null)
    : isSuccess
      ? <CheckIcon className={ICON_SIZE[size]} />
      : isError
        ? <XIcon className={ICON_SIZE[size]} />
        : iconLeft
          ? <span aria-hidden="true" className={cn('shrink-0', ICON_SIZE[size])}>{iconLeft}</span>
          : null

  /* Text content */
  const textContent = isLoading && loadingText
    ? loadingText
    : isSuccess && successText
      ? successText
      : isError && errorText
        ? errorText
        : children

  return (
    <Root
      ref={ref}
      {...props}
      disabled={disabled || isActive}
      aria-busy={isLoading || undefined}
      aria-disabled={(disabled || isActive) || undefined}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center font-medium border',
        'transition-colors duration-150 select-none cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-patina',
        'disabled:opacity-50 disabled:pointer-events-none',
        /* size */
        iconOnly ? SIZE_ICON_ONLY[size] : SIZE[size],
        /* radius */
        radiusCls,
        /* intent × variant */
        intentCls,
        /* full width */
        fullWidth && 'w-full',
        className,
      )}
    >
      {/* Leading: spinner replaces icon in "replace" mode, or spinner is left of icon in "left" mode */}
      {loadingPosition === 'replace' ? leadingIcon : (
        <>
          {isLoading && <SpinnerIcon className={ICON_SIZE[size]} />}
          {!isLoading && iconLeft && (
            <span aria-hidden="true" className={cn('shrink-0', ICON_SIZE[size])}>{iconLeft}</span>
          )}
        </>
      )}

      {!iconOnly && textContent && (
        <span className="truncate">{textContent}</span>
      )}

      {!isLoading && !isSuccess && !isError && !iconOnly && iconRight && (
        <span aria-hidden="true" className={cn('shrink-0', ICON_SIZE[size])}>
          {iconRight}
        </span>
      )}
    </Root>
  )
})

Button.displayName = 'Button'
