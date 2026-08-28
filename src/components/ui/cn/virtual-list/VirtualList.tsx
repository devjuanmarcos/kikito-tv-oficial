"use client";
import type React from "react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

import type { VirtualListProps } from "./virtual-list.types";

export function VirtualList<T = unknown>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  ariaLabel,
  className,
  style,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.currentTarget as HTMLDivElement).scrollTop);
  }, []);

  return (
    // Achado real: tabIndex num elemento com role="list" violava jsx-a11y/no-noninteractive-tabindex
    // (uma lista em si não é um widget focável) — mas o viewport de scroll precisa ser alcançável
    // via teclado (sem outro descendente focável dentro dele), mesmo padrão documentado em
    // ScrollArea. Solução: tabIndex fica no viewport (sem role, igual ScrollArea), `role="list"`
    // move pro spacer interno — semanticamente mais correto (a "lista" são os itens, não o scroll).
    <div
      className={cn(
        "overflow-y-auto relative focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-patina",
        className
      )}
      style={{ height, ...style }}
      onScroll={onScroll}
      tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      <div className="relative w-full" style={{ height: totalHeight }} role="list" aria-label={ariaLabel}>
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
  );
}
