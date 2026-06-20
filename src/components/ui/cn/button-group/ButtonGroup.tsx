'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonGroupProps {
  children:     React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  attached?:    boolean
  className?:   string
  style?:       React.CSSProperties
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  attached    = true,
  className,
  style,
}: ButtonGroupProps) {
  const isH = orientation === 'horizontal'

  return (
    <div
      role="group"
      style={style}
      className={cn(
        'inline-flex',
        isH ? 'flex-row' : 'flex-col',
        attached ? 'items-stretch' : isH ? 'flex-row gap-2' : 'flex-col gap-2',
        attached && [
          '[&>*:not(:first-child):not(:last-child)]:rounded-none',
          isH
            ? '[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:border-l-0'
            : '[&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child)]:border-t-0',
        ],
        className,
      )}
    >
      {children}
    </div>
  )
}
