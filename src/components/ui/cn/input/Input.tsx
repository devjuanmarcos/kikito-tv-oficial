'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { InputProps, InputSize, InputVariant, InputStatus } from './input.types'

const SIZE_INPUT: Record<InputSize, string> = {
  sm: 'h-8  px-3   text-body-callout  rounded-[--radius-sm]',
  md: 'h-9  px-3.5 text-body-callout  rounded-[--radius-base]',
  lg: 'h-11 px-4   text-body-paragraph rounded-[--radius-md]',
}

const SIZE_ICON: Record<InputSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4   h-4',
  lg: 'w-4   h-4',
}

const SIZE_PADDING_LEFT: Record<InputSize, string> = {
  sm: 'pl-8',
  md: 'pl-9',
  lg: 'pl-10',
}

const SIZE_PADDING_RIGHT: Record<InputSize, string> = {
  sm: 'pr-8',
  md: 'pr-9',
  lg: 'pr-10',
}

const VARIANT: Record<InputVariant, string> = {
  outline: 'bg-sunken border border-rule focus:border-patina',
  filled:  'bg-graphite border border-transparent focus:border-patina focus:bg-sunken',
  flushed: 'bg-transparent border-0 border-b border-rule rounded-none focus:border-patina px-0',
}

const STATUS_BORDER: Record<InputStatus, string> = {
  default: '',
  error:   'border-danger focus:border-danger',
  success: 'border-success focus:border-success',
  warning: 'border-warning focus:border-warning',
}

const STATUS_HINT: Record<InputStatus, string> = {
  default: 'text-muted',
  error:   'text-danger',
  success: 'text-success',
  warning: 'text-warning',
}

const uniqueId = (() => {
  let n = 0
  return (prefix: string) => `${prefix}-${++n}`
})()

export function Input({
  size      = 'md',
  variant   = 'outline',
  status    = 'default',
  label,
  hint,
  error,
  iconLeft,
  iconRight,
  prefix,
  suffix,
  fullWidth = false,
  id: idProp,
  className,
  disabled,
  ...props
}: InputProps) {
  const id = React.useMemo(() => idProp ?? uniqueId('ks-input'), [idProp])
  const hintId = hint || error ? `${id}-hint` : undefined
  const displayHint = error || hint
  const resolvedStatus: InputStatus = error ? 'error' : status

  const hasIconLeft  = !!iconLeft
  const hasIconRight = !!iconRight
  const hasPrefix    = !!prefix
  const hasSuffix    = !!suffix

  return (
    <div className={cn('flex flex-col gap-1', fullWidth ? 'w-full' : 'w-auto')}>
      {label && (
        <label
          htmlFor={id}
          className="text-body-callout font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {hasPrefix && (
          <span className={cn(
            'absolute left-0 inset-y-0 flex items-center px-3 text-muted text-body-callout',
            'border-r border-rule bg-graphite rounded-l-[--radius-base] select-none pointer-events-none',
          )}>
            {prefix}
          </span>
        )}

        {hasIconLeft && !hasPrefix && (
          <span className={cn(
            'absolute left-3 inset-y-0 flex items-center pointer-events-none text-muted',
            SIZE_ICON[size],
          )}>
            {iconLeft}
          </span>
        )}

        <input
          {...props}
          id={id}
          disabled={disabled}
          aria-describedby={hintId}
          aria-invalid={resolvedStatus === 'error' || undefined}
          className={cn(
            'w-full outline-none transition-[border-color] duration-150',
            'text-foreground placeholder:text-faint',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            SIZE_INPUT[size],
            VARIANT[variant],
            STATUS_BORDER[resolvedStatus],
            hasIconLeft && !hasPrefix  && SIZE_PADDING_LEFT[size],
            hasIconRight && !hasSuffix && SIZE_PADDING_RIGHT[size],
            hasPrefix && 'pl-[calc(theme(spacing.10)+0.5rem)]',
            hasSuffix && 'pr-[calc(theme(spacing.10)+0.5rem)]',
            className,
          )}
        />

        {hasIconRight && !hasSuffix && (
          <span className={cn(
            'absolute right-3 inset-y-0 flex items-center pointer-events-none text-muted',
            SIZE_ICON[size],
          )}>
            {iconRight}
          </span>
        )}

        {hasSuffix && (
          <span className={cn(
            'absolute right-0 inset-y-0 flex items-center px-3 text-muted text-body-callout',
            'border-l border-rule bg-graphite rounded-r-[--radius-base] select-none pointer-events-none',
          )}>
            {suffix}
          </span>
        )}
      </div>

      {displayHint && (
        <p id={hintId} className={cn('text-body-caption', STATUS_HINT[resolvedStatus])}>
          {displayHint}
        </p>
      )}
    </div>
  )
}

Input.displayName = 'Input'
