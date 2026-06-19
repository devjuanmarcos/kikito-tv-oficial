'use client'
import React, { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import type { VirtualListProps } from './virtual-list.types'

export function VirtualList<T = unknown>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan  = 3,
  className,
  style,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight  = items.length * itemHeight
  const visibleCount = Math.ceil(height / itemHeight)
  const startIndex   = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex     = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2)

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.currentTarget as HTMLDivElement).scrollTop)
  }, [])

  return (
    <div
      className={cn('overflow-y-auto relative outline-none', className)}
      style={{ height, ...style }}
      onScroll={onScroll}
      tabIndex={0}
      role="list"
    >
      <div className="relative w-full" style={{ height: totalHeight }}>
        {items.slice(startIndex, endIndex + 1).map((item, i) => (
          <div
            key={startIndex + i}
            className="absolute w-full left-0 box-border"
            style={{ top: (startIndex + i) * itemHeight, height: itemHeight }}
            role="listitem"
          >
            {renderItem(item, startIndex + i)}
          </div>
        ))}
      </div>
    </div>
  )
}
