"use client";
import type React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type NoticeBarIntent = "info" | "success" | "warning" | "danger" | "neutral";

export interface NoticeBarAction {
  label: string;
  onClick: () => void;
}

export interface NoticeBarProps {
  children: React.ReactNode;
  intent?: NoticeBarIntent;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: NoticeBarAction;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ICON: Record<NoticeBarIntent, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  danger: "✕",
  neutral: "·",
};

const INTENT_CLS: Record<NoticeBarIntent, string> = {
  info: "bg-info/10    border-info/30    text-info",
  success: "bg-success/10 border-success/30 text-success",
  warning: "bg-warning/10 border-warning/30 text-warning",
  danger: "bg-danger/10  border-danger/30  text-danger",
  neutral: "bg-graphite   border-rule       text-foreground",
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
    <span className="text-[0.875rem] font-bold leading-none select-none" aria-hidden="true">
      {DEFAULT_ICON[intent]}
    </span>
  );

  return (
    <div
      role="status"
      style={style}
      className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 rounded-(--radius-md) border text-body-callout",
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
          className="shrink-0 text-body-caption font-semibold underline-offset-2 hover:underline transition-[text-decoration] ml-2"
        >
          {action.label}
        </button>
      )}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="shrink-0 p-0.5 rounded-(--radius-xs) opacity-60 hover:opacity-100 transition-opacity ml-1"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
