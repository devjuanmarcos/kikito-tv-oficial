"use client";
import { cn } from "@/lib/utils";

import type { DotStepperProps } from "./dot-stepper.types";

export function DotStepper({ steps, current, onChange, variant = "dot", className, style }: DotStepperProps) {
  if (variant === "progress") {
    const pct = steps > 1 ? (current / (steps - 1)) * 100 : 100;
    return (
      <div style={style} className={cn("flex items-center gap-(--spacing-sm)", className)}>
        <div className="flex-1 h-1 bg-graphite-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-patina transition-[width] duration-[300ms] ease-in-out rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span role="status" aria-live="polite" className="text-body-caption text-faint tabular-nums whitespace-nowrap">
          {current + 1}/{steps}
        </span>
      </div>
    );
  }

  if (variant === "dash") {
    return (
      <div
        style={style}
        role="group"
        aria-label="Pagination"
        className={cn("flex items-center gap-(--spacing-xs)", className)}
      >
        {Array.from({ length: steps }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to step ${i + 1}`}
            aria-current={i === current ? "step" : undefined}
            onClick={() => onChange?.(i)}
            className={cn(
              "h-1 rounded-full transition-[width,background] duration-[200ms]",
              i === current ? "w-6 bg-patina" : "w-3 bg-graphite-2 hover:bg-rule"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={style}
      role="group"
      aria-label="Pagination"
      className={cn("flex items-center gap-(--spacing-sm)", className)}
    >
      {Array.from({ length: steps }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to step ${i + 1}`}
          aria-current={i === current ? "step" : undefined}
          onClick={() => onChange?.(i)}
          className={cn(
            "rounded-full transition-[width,height,background] duration-[200ms]",
            i === current ? "w-2.5 h-2.5 bg-patina" : "w-2 h-2 bg-graphite-2 hover:bg-rule"
          )}
        />
      ))}
    </div>
  );
}
