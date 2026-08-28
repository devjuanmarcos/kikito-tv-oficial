"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { NoticeBarIntent, NoticeBarProps } from "./notice-bar.types";

const DEFAULT_ICON: Record<NoticeBarIntent, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  danger: "✕",
  neutral: "·",
};

// bg-*-soft / text-*-soft-fg: par canônico pré-validado AA (ver CLAUDE.md), no lugar da
// opacidade ad-hoc que estava aqui antes (bg-info/10 border-info/30 text-info). Border segue
// com opacidade — não existe border-*-soft na paleta (pares soft são bg/text).
const INTENT_CLS: Record<NoticeBarIntent, string> = {
  info: "bg-info-soft border-info/30 text-info-soft-fg",
  success: "bg-success-soft border-success/30 text-success-soft-fg",
  warning: "bg-warning-soft border-warning/30 text-warning-soft-fg",
  danger: "bg-danger-soft border-danger/30 text-danger-soft-fg",
  neutral: "bg-graphite border-rule text-foreground",
};

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className="w-3.5 h-3.5"
  >
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

export function NoticeBar({
  children,
  intent = "info",
  dismissible = false,
  icon,
  action,
  className,
  style,
}: NoticeBarProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const iconEl = icon ?? (
    <span className="text-body-callout font-bold leading-none select-none" aria-hidden="true">
      {DEFAULT_ICON[intent]}
    </span>
  );

  return (
    <div
      role="status"
      style={style}
      className={cn(
        // gap-2.5/py-2.5: sem match exato na escala de spacing
        "flex items-center gap-2.5 px-(--spacing-lg) py-2.5 rounded-(--radius-md) border text-body-callout",
        INTENT_CLS[intent],
        className
      )}
    >
      <span className="shrink-0">{iconEl}</span>
      <span className="flex-1 leading-[1.5]">{children}</span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="shrink-0 text-body-caption font-semibold underline-offset-2 hover:underline transition-[text-decoration] ml-(--spacing-sm)"
        >
          {action.label}
        </button>
      )}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="shrink-0 p-(--spacing-3xs) rounded-(--radius-xs) opacity-60 hover:opacity-100 transition-opacity ml-(--spacing-2xs)"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
