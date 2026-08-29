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

// achado real: "neutral" era o único intent que não seguia o próprio padrão do arquivo
// (dot=cor sólida do intent, ring=mesma cor a 40%) — usava diluição de text-foreground em
// vez do token `bg-neutral` que já existe no projeto (mesmo usado no Button neutral/solid)
const INTENT_COLOR: Record<PingIntent, { dot: string; ring: string }> = {
  primary: { dot: "bg-patina", ring: "bg-patina/40" },
  success: { dot: "bg-success", ring: "bg-success/40" },
  warning: { dot: "bg-warning", ring: "bg-warning/40" },
  danger: { dot: "bg-danger", ring: "bg-danger/40" },
  info: { dot: "bg-info", ring: "bg-info/40" },
  neutral: { dot: "bg-neutral", ring: "bg-neutral/40" },
};

export function Ping({
  intent = "primary",
  size = "md",
  animate = true,
  label,
  children,
  className,
  style,
}: PingProps) {
  const colors = INTENT_COLOR[intent];

  const dot = (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn("relative inline-flex", SIZE_WRAPPER[size], className)}
      style={!children ? style : undefined}
    >
      {animate && (
        <span
          aria-hidden="true"
          className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", colors.ring)}
        />
      )}
      <span
        aria-hidden={label ? true : undefined}
        className={cn("relative inline-flex rounded-full", SIZE_DOT[size], colors.dot)}
      />
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
