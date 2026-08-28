import React from "react";

import { cn } from "@/lib/utils";

import type { MasonryProps } from "./masonry.types";

// `columns` aceita number OU { sm, md, lg } (mobile-first, com fallback em
// cascata pro tier anterior) — registry e tipo já anunciavam breakpoint por
// tier, mas o componente só lia `.md` e ignorava `sm`/`lg` silenciosamente.
function resolveColumns(columns: MasonryProps["columns"]) {
  if (typeof columns === "number") {
    return { sm: columns, md: columns, lg: columns };
  }
  const sm = columns.sm ?? 1;
  const md = columns.md ?? sm;
  const lg = columns.lg ?? md;
  return { sm, md, lg };
}

export function Masonry({ children, columns = 3, gap = 16, className, style }: MasonryProps) {
  const { sm, md, lg } = resolveColumns(columns);
  const gapPx = `${gap}px`;

  return (
    <div
      className={cn(
        "[column-count:var(--masonry-cols-sm)] md:[column-count:var(--masonry-cols-md)] lg:[column-count:var(--masonry-cols-lg)] [&>*]:break-inside-avoid",
        className
      )}
      style={
        {
          "--masonry-cols-sm": sm,
          "--masonry-cols-md": md,
          "--masonry-cols-lg": lg,
          columnGap: gapPx,
          ...style,
        } as React.CSSProperties
      }
    >
      {React.Children.toArray(children).map((child, i) => (
        <div key={i} style={{ marginBottom: gapPx }}>
          {child}
        </div>
      ))}
    </div>
  );
}
