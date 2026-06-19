import React from 'react'
import { cn } from '@/lib/utils'
import type { MasonryProps } from './masonry.types'

export function Masonry({
  children,
  columns = 3,
  gap = 16,
  className,
  style,
}: MasonryProps) {
  const cols  = typeof columns === 'number' ? columns : (columns as Record<string, number>).md ?? 3
  const gapPx = `${gap}px`

  return (
    <div
      className={cn('[&>*]:break-inside-avoid', className)}
      style={{ columns: cols, columnGap: gapPx, ...style }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} style={{ marginBottom: gapPx }}>{child}</div>
          ))
        : <div style={{ marginBottom: gapPx }}>{children}</div>
      }
    </div>
  )
}
