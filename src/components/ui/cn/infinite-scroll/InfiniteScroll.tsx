"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import type { InfiniteScrollProps } from "./infinite-scroll.types";

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
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div className={cn("flex flex-col", className)} style={style}>
      {children}

      {isLoading && (
        <div role="status" aria-label="Loading more" className="flex justify-center py-(--spacing-lg)">
          {loader ?? (
            <div
              aria-hidden="true"
              className="w-6 h-6 border-2 border-rule border-t-patina rounded-full animate-spin"
            />
          )}
        </div>
      )}

      {!hasMore && endMessage && (
        <div role="status" className="flex justify-center py-(--spacing-lg) text-body-callout text-faint">
          {endMessage}
        </div>
      )}

      <div ref={sentinelRef} className="h-px" />
    </div>
  );
}
