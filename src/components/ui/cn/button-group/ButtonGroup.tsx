"use client";
import { cn } from "@/lib/utils";

import type { ButtonGroupProps } from "./button-group.types";

export function ButtonGroup({
  children,
  orientation = "horizontal",
  attached = true,
  "aria-label": ariaLabel,
  className,
  style,
}: ButtonGroupProps) {
  const isH = orientation === "horizontal";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={style}
      className={cn(
        "inline-flex",
        isH ? "flex-row" : "flex-col",
        attached ? "items-stretch" : isH ? "flex-row gap-(--spacing-sm)" : "flex-col gap-(--spacing-sm)",
        attached && [
          "[&>*:not(:first-child):not(:last-child)]:rounded-none",
          isH
            ? "[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:border-l-0"
            : "[&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child)]:border-t-0",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
