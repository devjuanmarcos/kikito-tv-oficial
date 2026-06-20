'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  children:      React.ReactNode
  label?:        string
  hint?:         string
  errorMessage?: string
  required?:     boolean
  htmlFor?:      string
  className?:    string
  style?:        React.CSSProperties
}

export function FormField({
  children,
  label,
  hint,
  errorMessage,
  required,
  htmlFor,
  className,
  style,
}: FormFieldProps) {
  const hasError = !!errorMessage
  return (
    <div style={style} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-body-callout font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {hasError ? (
        <p role="alert" className="flex items-center gap-1 text-body-caption text-danger">
          <span aria-hidden="true">⚠</span>
          {errorMessage}
        </p>
      ) : hint ? (
        <p className="text-body-caption text-faint">{hint}</p>
      ) : null}
    </div>
  )
}
