"use client";

import { Card } from "../card/Card";

import type { GlowCardProps } from "./glow-card.types";

/** Backward-compat wrapper over the Super `Card` (`effect="glow"`). */
export function GlowCard({
  children,
  glowColor = "var(--ks-primary)",
  glowSize = 400,
  glowOpacity = 0.14,
  radius = 16,
  padding = 20,
  className,
  style,
}: GlowCardProps) {
  return (
    <Card
      effect="glow"
      glowColor={glowColor}
      glowSize={glowSize}
      glowOpacity={glowOpacity}
      effectRadius={radius}
      effectPadding={padding}
      className={className}
      style={style}
    >
      {children}
    </Card>
  );
}
