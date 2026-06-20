'use client'
import type React from 'react'
import { useState, useId } from 'react'
import { cn } from '@/lib/utils'

export type FloatingLabelVariant = 'outline' | 'filled' | 'underline'
export type FloatingLabelSize    = 'sm' | 'md' | 'lg'

export interface FloatingLabelInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label:         string
  id?:           string
  variant?:      FloatingLabelVariant
  size?:         FloatingLabelSize
  invalid?:      boolean
  hint?:         string
  errorMessage?: string
  className?:    string
  style?:        React.CSSProperties
}

const SIZE_WRAP: Record<FloatingLabelSize, string> = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-14',
}
const SIZE_INPUT: Record<FloatingLabelSize, string> = {
  sm: 'text-sm px-3',
  md: 'text-sm px-3',
  lg: 'text-base px-4',
}
const SIZE_LABEL_RESTING: Record<FloatingLabelSize, string> = {
  sm: 'text-sm top-[50%] -translate-y-1/2 left-3',
  md: 'text-sm top-[50%] -translate-y-1/2 left-3',
  lg: 'text-base top-[50%] -translate-y-1/2 left-4',
}
const SIZE_LABEL_FLOAT: Record<FloatingLabelSize, string> = {
  sm: 'text-[0.65rem] top-1.5 left-3',
  md: 'text-[0.65rem] top-1.5 left-3',
  lg: 'text-[0.65rem] top-1.5 left-4',
}
const SIZE_INPUT_PT: Record<FloatingLabelSize, string> = {
  sm: 'pt-4 pb-1',
  md: 'pt-5 pb-1',
  lg: 'pt-6 pb-1',
}

const VARIANT_WRAP: Record<FloatingLabelVariant, string> = {
  outline:   'border border-rule rounded-lg bg-transparent',
  filled:    'bg-graphite rounded-lg border border-transparent',
  underline: 'border-b border-rule rounded-none bg-transparent',
}
const VARIANT_FOCUS: Record<FloatingLabelVariant, string> = {
  outline:   'focus-within:border-patina',
  filled:    'focus-within:border-patina focus-within:bg-graphite-2',
  underline: 'focus-within:border-patina',
}
const VARIANT_ERROR: Record<FloatingLabelVariant, string> = {
  outline:   'border-danger',
  filled:    'border-danger',
  underline: 'border-danger',
}

export function FloatingLabelInput({
  label,
  id,
  value,
  defaultValue,
  onChange,
  type      = 'text',
  variant   = 'outline',
  size      = 'md',
  disabled  = false,
  invalid   = false,
  hint,
  errorMessage,
  className,
  style,
  ...inputProps
}: FloatingLabelInputProps) {
  const uid = useId()
  const inputId = id ?? uid

  const isControlled = value !== undefined
  const [internalVal, setInternalVal] = useState(defaultValue as string ?? '')
  const currentVal = isControlled ? (value as string) : internalVal

  const [focused, setFocused] = useState(false)
  const floated = focused || currentVal.length > 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalVal(e.target.value)
    onChange?.(e)
  }

  const hasError = invalid || !!errorMessage

  return (
    <div style={style} className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'relative w-full transition-[border-color,background] duration-[120ms]',
          SIZE_WRAP[size],
          VARIANT_WRAP[variant],
          !hasError && VARIANT_FOCUS[variant],
          hasError && VARIANT_ERROR[variant],
          disabled && 'opacity-50',
        )}
      >
        <input
          {...inputProps}
          id={inputId}
          type={type}
          value={isControlled ? value : internalVal}
          defaultValue={undefined}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errorMessage ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          onFocus={(e) => { setFocused(true); inputProps.onFocus?.(e) }}
          onBlur={(e)  => { setFocused(false); inputProps.onBlur?.(e) }}
          className={cn(
            'w-full h-full bg-transparent outline-none text-foreground placeholder-transparent',
            SIZE_INPUT[size],
            floated && SIZE_INPUT_PT[size],
          )}
          placeholder={label}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'absolute pointer-events-none text-faint transition-all duration-[120ms] ease-in-out',
            floated
              ? [SIZE_LABEL_FLOAT[size], 'text-patina']
              : SIZE_LABEL_RESTING[size],
            hasError && floated && 'text-danger',
          )}
        >
          {label}
        </label>
      </div>
      {hasError && errorMessage ? (
        <p id={`${inputId}-err`} role="alert" className="flex items-center gap-1 text-body-caption text-danger">
          <span aria-hidden="true">⚠</span>
          {errorMessage}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-body-caption text-faint">{hint}</p>
      ) : null}
    </div>
  )
}
