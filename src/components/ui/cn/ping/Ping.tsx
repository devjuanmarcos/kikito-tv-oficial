"use client";
import { cn } from "@/lib/utils";

import type { PingIntent, PingSize, PingProps } from "./ping.types";

const SIZE_DOT: Record<PingSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
};

const SIZE_WRAPPER: Record<PingSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
};

const INTENT_COLOR: Record<PingIntent, { dot: string; ring: string }> = {
  primary: { dot: "bg-patina", ring: "bg-patina/40" },
  success: { dot: "bg-success", ring: "bg-success/40" },
  warning: { dot: "bg-warning", ring: "bg-warning/40" },
  danger: { dot: "bg-danger", ring: "bg-danger/40" },
  info: { dot: "bg-info", ring: "bg-info/40" },
  neutral: { dot: "bg-foreground/50", ring: "bg-foreground/20" },
};

export function Ping({ intent = "primary", size = "md", animate = true, children, className, style }: PingProps) {
  const colors = INTENT_COLOR[intent];

  const dot = (
    <span className={cn("relative inline-flex", SIZE_WRAPPER[size], className)} style={!children ? style : undefined}>
      {animate && (
        <span
          aria-hidden="true"
          className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", colors.ring)}
        />
      )}
      <span className={cn("relative inline-flex rounded-full", SIZE_DOT[size], colors.dot)} />
    </span>
  );

  if (!children) return dot;

  return (
    <span className="relative inline-flex" style={style}>
      {children}
      <span className="absolute -top-0.5 -right-0.5">{dot}</span>
    </span>
  );
}
