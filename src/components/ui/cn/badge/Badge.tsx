"use client";

import React from "react";

import { cn } from "@/lib/utils";

import type { BadgeProps, BadgeVariant, BadgeSize, BadgeRounded, BadgeIntent } from "./badge.types";

/* sm/md below scale minimum: badges intentionally render micro-labels smaller
   than the smallest typography token (text-body-caption, 0.75rem) */
const SIZE: Record<BadgeSize, string> = {
  sm: "px-2   py-[0.1875rem] gap-1   text-[0.625rem]  tracking-[0.04em] leading-none",
  md: "px-2.5 py-1           gap-1.5 text-[0.6875rem] tracking-[0.03em] leading-none",
  lg: "px-3   py-[0.3125rem] gap-1.5 text-body-caption tracking-[0.02em] leading-none",
};

const ROUNDED_MAP: Record<BadgeRounded, string> = {
  none: "rounded-none",
  sm: "rounded-(--radius-xs)",
  md: "rounded-(--radius-sm)",
  lg: "rounded-(--radius-md)",
  full: "rounded-full",
};

const DOT_SIZE: Record<BadgeSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2   h-2",
  lg: "w-2   h-2",
};

type IntentVariantKey = `${BadgeIntent}/${BadgeVariant}`;

const INTENT_VARIANT: Record<IntentVariantKey, string> = {
  /* primary */
  "primary/solid": "bg-patina text-patina-fg border-transparent",
  "primary/outline": "bg-transparent text-patina border-patina/45",
  "primary/soft": "bg-patina-soft text-patina-soft-fg border-transparent",
  "primary/ghost": "bg-transparent text-patina border-transparent",
  "primary/dot": "bg-patina-soft text-patina-soft-fg border-transparent",

  /* secondary */
  "secondary/solid": "bg-kinpaku text-kinpaku-fg border-transparent",
  "secondary/outline": "bg-transparent text-kinpaku border-kinpaku/45",
  "secondary/soft": "bg-kinpaku-soft text-kinpaku-soft-fg border-transparent",
  "secondary/ghost": "bg-transparent text-kinpaku border-transparent",
  "secondary/dot": "bg-kinpaku-soft text-kinpaku-soft-fg border-transparent",

  /* danger */
  "danger/solid": "bg-danger text-danger-fg border-transparent",
  "danger/outline": "bg-transparent text-danger border-danger/45",
  "danger/soft": "bg-danger-soft text-danger-soft-fg border-transparent",
  "danger/ghost": "bg-transparent text-danger border-transparent",
  "danger/dot": "bg-danger-soft text-danger-soft-fg border-transparent",

  /* success */
  "success/solid": "bg-success text-success-fg border-transparent",
  "success/outline": "bg-transparent text-success border-success/45",
  "success/soft": "bg-success-soft text-success-soft-fg border-transparent",
  "success/ghost": "bg-transparent text-success border-transparent",
  "success/dot": "bg-success-soft text-success-soft-fg border-transparent",

  /* warning */
  "warning/solid": "bg-warning text-warning-fg border-transparent",
  "warning/outline": "bg-transparent text-warning border-warning/45",
  "warning/soft": "bg-warning-soft text-warning-soft-fg border-transparent",
  "warning/ghost": "bg-transparent text-warning border-transparent",
  "warning/dot": "bg-warning-soft text-warning-soft-fg border-transparent",

  /* info */
  "info/solid": "bg-info text-info-fg border-transparent",
  "info/outline": "bg-transparent text-info border-info/45",
  "info/soft": "bg-info-soft text-info-soft-fg border-transparent",
  "info/ghost": "bg-transparent text-info border-transparent",
  "info/dot": "bg-info-soft text-info-soft-fg border-transparent",

  /* neutral */
  "neutral/solid": "bg-neutral text-neutral-fg border-transparent",
  "neutral/outline": "bg-transparent text-foreground border-rule",
  "neutral/soft": "bg-graphite text-foreground border-transparent",
  "neutral/ghost": "bg-transparent text-muted border-transparent",
  "neutral/dot": "bg-graphite text-foreground border-transparent",
};

export function Badge({
  variant = "soft",
  size = "md",
  intent = "primary",
  rounded,
  dot,
  dismissible,
  iconLeft,
  iconRight,
  onDismiss,
  className,
  children,
  ...props
}: BadgeProps) {
  const key = `${intent}/${variant}` as IntentVariantKey;
  const intentCls = INTENT_VARIANT[key] ?? INTENT_VARIANT["neutral/soft"];
  const radiusCls = rounded ? ROUNDED_MAP[rounded] : "rounded-full";
  const showDot = dot || variant === "dot";

  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center font-semibold border select-none whitespace-nowrap align-middle",
        SIZE[size],
        radiusCls,
        intentCls,
        className
      )}
    >
      {showDot && (
        <span aria-hidden="true" className={cn("shrink-0 rounded-full bg-current opacity-70", DOT_SIZE[size])} />
      )}

      {!showDot && iconLeft && (
        <span aria-hidden="true" className="shrink-0 w-3 h-3 flex items-center justify-center">
          {iconLeft}
        </span>
      )}

      {children}

      {!showDot && iconRight && (
        <span aria-hidden="true" className="shrink-0 w-3 h-3 flex items-center justify-center">
          {iconRight}
        </span>
      )}

      {(dismissible || onDismiss) && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="shrink-0 ml-0.5 -mr-0.5 w-3 h-3 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-patina"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

Badge.displayName = "Badge";
