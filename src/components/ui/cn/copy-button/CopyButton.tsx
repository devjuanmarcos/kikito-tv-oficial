'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/cn/button'
import type { ButtonVariant, ButtonSize } from '@/components/ui/cn/button'
import type { CopyButtonProps } from './copy-button.types'

const CopyIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>

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

  return (
    <Button
      intent="neutral"
      variant={variant as ButtonVariant}
      size={size as ButtonSize}
      iconLeft={copied ? <CheckIcon /> : <CopyIcon />}
      onClick={handleCopy}
      className={cn(copied && 'text-success!', className)}
      style={style}
      aria-label={copied ? successLabel : label}
    >
      {copied ? successLabel : label}
    </Button>
  )
}
