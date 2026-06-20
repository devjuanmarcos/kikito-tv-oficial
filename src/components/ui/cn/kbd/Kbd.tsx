'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export type KbdSize    = 'sm' | 'md' | 'lg'
export type KbdVariant = 'default' | 'ghost' | 'solid'

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?:    KbdSize
  variant?: KbdVariant
}

export interface KbdSequenceProps {
  keys:       string[]
  separator?: string
  size?:      KbdSize
  variant?:   KbdVariant
}

const SIZE: Record<KbdSize, string> = {
  sm: 'h-4 min-w-[1rem] px-1   text-[0.6rem]  rounded-[3px]',
  md: 'h-5 min-w-[1.25rem] px-1.5 text-[0.7rem]  rounded-[4px]',
  lg: 'h-6 min-w-[1.5rem] px-2   text-[0.8rem]  rounded-[4px]',
}

const VARIANT: Record<KbdVariant, string> = {
  default: 'bg-graphite border border-rule text-foreground shadow-[0_1px_0_0_var(--ks-rule)]',
  ghost:   'bg-transparent border border-rule text-faint',
  solid:   'bg-foreground text-base border border-foreground',
}

export function Kbd({ size = 'md', variant = 'default', className, children, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        'inline-flex items-center justify-center font-mono font-medium select-none leading-none',
        SIZE[size],
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </kbd>
  )
}

export function KbdSequence({ keys, separator = '⌘', size = 'md', variant = 'default' }: KbdSequenceProps) {
  const isSymbol = !separator || separator === '+' || separator === '→' || separator === 'then'
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span className="text-faint text-[0.7rem] select-none">{separator ?? '+'}</span>
          )}
          <Kbd size={size} variant={variant}>{k}</Kbd>
        </span>
      ))}
    </span>
  )
}
