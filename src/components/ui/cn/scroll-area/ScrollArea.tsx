import React from 'react'
import { cn } from '@/lib/utils'
import type { ScrollAreaProps } from './scroll-area.types'

const ORIENTATION_CLS: Record<string, string> = {
  vertical:   'overflow-x-hidden overflow-y-auto',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both:       'overflow-auto',
}

export function ScrollArea({
  children,
  orientation = 'vertical',
  maxHeight,
  maxWidth,
  className,
  style,
}: ScrollAreaProps) {
  const maxStyle: React.CSSProperties = {}
  if (maxHeight) maxStyle.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
  if (maxWidth)  maxStyle.maxWidth  = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth

  return (
    <div className={cn('relative overflow-hidden', className)} style={style}>
      <div
        className={cn(
          'w-full h-full [scrollbar-width:thin] [scrollbar-color:var(--ks-rule)_transparent]',
          '[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:h-[6px]',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-rule [&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-[color-mix(in_srgb,var(--ks-text-muted)_50%,transparent)]',
          '[&::-webkit-scrollbar-corner]:bg-transparent',
          ORIENTATION_CLS[orientation] ?? ORIENTATION_CLS.vertical,
        )}
        style={maxStyle}
      >
        {children}
      </div>
    </div>
  )
}
