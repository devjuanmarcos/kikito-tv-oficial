"use client";

import { cn } from "@/lib/utils";

import type { TagIntent, TagAppearance, TagSize, TagProps } from "./tag.types";

// Escala própria do componente (dimensão/tipografia por size), não migra pra spacing
// genérico. text-[0.6875rem] (11px, tier sm): below scale minimum.
const SIZE: Record<TagSize, string> = {
  sm: "h-5  px-1.5 gap-1   text-[0.6875rem] rounded-(--radius-xs)",
  md: "h-6  px-2   gap-1   text-body-caption rounded-(--radius-xs)",
  lg: "h-7  px-2.5 gap-1.5 text-body-callout rounded-(--radius-sm)",
};

type IntentAppKey = `${TagIntent}/${TagAppearance}`;

const INTENT_APP: Record<IntentAppKey, string> = {
  "primary/soft": "bg-patina/10 text-patina border-transparent",
  "primary/solid": "bg-patina text-patina-fg border-transparent",
  "primary/outline": "bg-transparent text-patina border-patina",

  "info/soft": "bg-info/10 text-info border-transparent",
  "info/solid": "bg-info text-info-fg border-transparent",
  "info/outline": "bg-transparent text-info border-info",

  "success/soft": "bg-success/10 text-success border-transparent",
  "success/solid": "bg-success text-success-fg border-transparent",
  "success/outline": "bg-transparent text-success border-success",

  "warning/soft": "bg-warning/10 text-warning border-transparent",
  "warning/solid": "bg-warning text-warning-fg border-transparent",
  "warning/outline": "bg-transparent text-warning border-warning",

  "danger/soft": "bg-danger/10 text-danger border-transparent",
  "danger/solid": "bg-danger text-danger-fg border-transparent",
  "danger/outline": "bg-transparent text-danger border-danger",

  "neutral/soft": "bg-graphite text-foreground border-transparent",
  "neutral/solid": "bg-foreground text-base border-transparent",
  "neutral/outline": "bg-transparent text-foreground border-rule",
};

export function Tag({
  intent = "neutral",
  appearance = "soft",
  size = "md",
  icon,
  removable,
  onRemove,
  onClick,
  className,
  style,
  children,
}: TagProps) {
  const key = `${intent}/${appearance}` as IntentAppKey;
  const cls = INTENT_APP[key] ?? INTENT_APP["neutral/soft"];
  const isClick = !!onClick;

  const Root = isClick ? "button" : "span";

  return (
    <Root
      type={isClick ? "button" : undefined}
      onClick={isClick ? onClick : undefined}
      style={style}
      className={cn(
        "inline-flex items-center font-medium border select-none whitespace-nowrap",
        SIZE[size],
        cls,
        isClick && "cursor-pointer hover:brightness-110 transition-[filter] duration-[100ms]",
        className
      )}
    >
      {icon && (
        <span aria-hidden="true" className="shrink-0 w-3 h-3 flex items-center justify-center">
          {icon}
        </span>
      )}
      {children}
      {(removable || onRemove) && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="shrink-0 -mr-0.5 w-3 h-3 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </Root>
  );
}
