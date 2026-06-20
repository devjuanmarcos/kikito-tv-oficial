'use client'
import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ReadMoreProps {
  children:       string
  maxLength?:     number
  expandLabel?:   string
  collapseLabel?: string
  className?:     string
  style?:         React.CSSProperties
}

export function ReadMore({
  children,
  maxLength      = 150,
  expandLabel    = 'Read more',
  collapseLabel  = 'Show less',
  className,
  style,
}: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = children.length > maxLength

  if (!needsTruncation) {
    return <span style={style} className={className}>{children}</span>
  }

  return (
    <span style={style} className={cn('inline', className)}>
      {expanded ? children : `${children.slice(0, maxLength).trimEnd()}… `}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="text-patina font-medium hover:underline transition-[text-decoration] underline-offset-2 text-inherit"
      >
        {expanded ? collapseLabel : expandLabel}
      </button>
    </span>
  )
}
