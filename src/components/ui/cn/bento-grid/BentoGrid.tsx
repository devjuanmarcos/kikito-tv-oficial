import { cn } from "@/lib/utils";

import type { BentoGridProps } from "./bento-grid.types";

const COL_SPAN: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
};

const ROW_SPAN: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
};

export function BentoGrid({ items, cols = 3, gap = 16, className, style }: BentoGridProps) {
  return (
    <div className={cn("grid", cols === 3 ? "grid-cols-3" : "grid-cols-4", className)} style={{ gap, ...style }}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "rounded-(--radius-lg) border border-rule bg-raised overflow-hidden",
            COL_SPAN[item.colSpan ?? 1],
            ROW_SPAN[item.rowSpan ?? 1],
            item.className
          )}
        >
          {item.children}
        </div>
      ))}
    </div>
  );
}
