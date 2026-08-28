"use client";
import { Button } from "@/components/ui/cn/button";
import { cn } from "@/lib/utils";

import type { FloatingBarProps } from "./floating-bar.types";

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

export function FloatingBar({
  children,
  position = "bottom",
  visible = true,
  onDismiss,
  className,
  style,
}: FloatingBarProps) {
  return (
    <div
      style={style}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={cn(
        "fixed z-[850] left-1/2 -translate-x-1/2 transition-[opacity,transform] duration-[200ms] ease-in-out",
        position === "bottom" ? "bottom-(--spacing-xl)" : "top-(--spacing-xl)",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : position === "bottom"
            ? "opacity-0 translate-y-(--spacing-lg) pointer-events-none"
            : "opacity-0 -translate-y-(--spacing-lg) pointer-events-none",
        className
      )}
    >
      <div className="flex items-center gap-(--spacing-md) px-(--spacing-lg) py-(--spacing-md) rounded-xl bg-raised border border-rule shadow-[0_8px_32px_-8px_oklch(0%_0_0/0.5)]">
        {children}
        {onDismiss && (
          <Button
            variant="ghost"
            intent="neutral"
            size="xs"
            iconOnly
            iconLeft={<XIcon />}
            onClick={onDismiss}
            aria-label="Dismiss"
            className="ml-(--spacing-3xs) flex-shrink-0"
          />
        )}
      </div>
    </div>
  );
}
