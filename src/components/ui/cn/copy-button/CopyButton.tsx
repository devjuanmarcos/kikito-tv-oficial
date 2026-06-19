'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CopyButtonProps } from './copy-button.types'

const CopyIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>

const VARIANT_CLS: Record<string, string> = {
  outline: 'border border-rule bg-transparent text-foreground hover:bg-sunken',
  ghost:   'border-none bg-transparent text-muted hover:bg-sunken hover:text-foreground',
  solid:   'border-none bg-sunken text-foreground hover:bg-raised',
}

const SIZE_CLS: Record<string, { h: string; px: string; fs: string; r: string; icon: string }> = {
  sm: { h: 'h-7',  px: 'px-[0.625rem]', fs: 'text-[0.75rem]',   r: 'rounded-[5px]', icon: 'w-3 h-3' },
  md: { h: 'h-9',  px: 'px-[0.875rem]', fs: 'text-[0.8125rem]', r: 'rounded-[7px]', icon: 'w-[14px] h-[14px]' },
  lg: { h: 'h-11', px: 'px-[1.125rem]', fs: 'text-[0.875rem]',  r: 'rounded-[9px]', icon: 'w-4 h-4' },
}

export function CopyButton({
  text,
  label        = 'Copy',
  successLabel = 'Copied!',
  size         = 'md',
  variant      = 'outline',
  timeout      = 2000,
  onCopy,
  className,
  style,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), timeout)
    } catch {
      // clipboard API unavailable
    }
  }

  const sz = SIZE_CLS[size]

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 font-medium font-[inherit] cursor-pointer whitespace-nowrap transition-[background,color,border-color] duration-[150ms]',
        sz.h, sz.px, sz.fs, sz.r,
        VARIANT_CLS[variant],
        copied && 'text-success!',
        className,
      )}
      style={style}
      onClick={handleCopy}
      aria-label={copied ? successLabel : label}
    >
      <span className={cn('shrink-0 [&>svg]:w-full [&>svg]:h-full', sz.icon)}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      {copied ? successLabel : label}
    </button>
  )
}
