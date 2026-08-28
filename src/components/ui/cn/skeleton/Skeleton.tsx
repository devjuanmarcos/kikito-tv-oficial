import { cn } from "@/lib/utils";

import type { SkeletonProps, SkeletonShape } from "./skeleton.types";

const SHAPE_CLS: Record<SkeletonShape, string> = {
  default: "rounded-none",
  rounded: "rounded-(--radius-sm)",
  circle: "rounded-full",
  pill: "rounded-full",
};

function toPx(v: string | number | undefined, fallback: string): string {
  if (v === undefined) return fallback;
  return typeof v === "number" ? `${v}px` : v;
}

export function Skeleton({ width, height, shape = "default", animate = true, className, style }: SkeletonProps) {
  return (
    <span
      className={cn("block bg-graphite", animate && "animate-pulse", SHAPE_CLS[shape], className)}
      style={{
        width: toPx(width, "100%"),
        height: toPx(height, "1rem"),
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
