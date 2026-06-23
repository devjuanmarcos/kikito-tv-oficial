"use client";

import { Card } from "../card/Card";

import type { GlassCardProps } from "./glass-card.types";

/** Backward-compat wrapper over the Super `Card` (`effect="glass"`). */
export function GlassCard({ blur = 12, opacity = 0.1, border = true, className, style, children }: GlassCardProps) {
  return (
    <Card effect="glass" blur={blur} opacity={opacity} border={border} className={className} style={style}>
      {children}
    </Card>
  );
}
