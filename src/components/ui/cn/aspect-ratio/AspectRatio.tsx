'use client'
import type React from 'react'
import { cn } from '@/lib/utils'

export interface AspectRatioProps {
  children:   React.ReactNode
  ratio?:     number
  className?: string
  style?:     React.CSSProperties
}

export function AspectRatio({
  children,
  ratio     = 16 / 9,
  className,
  style,
}: AspectRatioProps) {
  return (
    <div
      style={{ paddingBottom: `${(1 / ratio) * 100}%`, position: 'relative', ...style }}
      className={cn('w-full', className)}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  )
}
