'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { InfiniteScrollProps } from './infinite-scroll.types'

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  loader,
  endMessage,
  threshold = 0.1,
  className,
  style,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={cn('flex flex-col', className)} style={style}>
      {children}

      {isLoading && (
        <div className="flex justify-center py-4">
          {loader ?? (
            <div className="w-6 h-6 border-2 border-rule border-t-patina rounded-full animate-spin" />
          )}
        </div>
      )}

      {!hasMore && endMessage && (
        <div className="flex justify-center py-4 text-[0.875rem] text-faint">
          {endMessage}
        </div>
      )}

      <div ref={sentinelRef} className="h-px" />
    </div>
  )
}
