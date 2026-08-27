import React from "react";

import { cn } from "@/lib/utils";

import type { StatusBadgeProps } from "./status-badge.types";

const LABELS: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
  idle: "Idle",
};

const STATUS_COLOR: Record<string, string> = {
  online: "var(--ks-success)",
  offline: "var(--ks-text-muted)",
  busy: "var(--ks-danger)",
  away: "var(--ks-warning)",
  idle: "var(--ks-info)",
};

const SIZE_DOT: Record<string, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

const SIZE_LABEL: Record<string, string> = {
  sm: "text-body-caption",
  md: "text-body-callout",
  lg: "text-body-callout",
};

export function StatusBadge({
  status,
  size = "md",
  showLabel = false,
  pulse = false,
  className,
  style,
}: StatusBadgeProps) {
  const color = STATUS_COLOR[status];
  const isOffline = status === "offline";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} style={style}>
      <span
        className={cn("rounded-full shrink-0 relative", SIZE_DOT[size], isOffline && "opacity-40")}
        style={{ background: color }}
      >
        {pulse && status === "online" && (
          <span
            aria-hidden="true"
            className="absolute -inset-[3px] rounded-full opacity-40 animate-ping"
            style={{ background: color }}
          />
        )}
      </span>
      {showLabel && <span className={cn("font-medium text-muted capitalize", SIZE_LABEL[size])}>{LABELS[status]}</span>}
    </span>
  );
}
