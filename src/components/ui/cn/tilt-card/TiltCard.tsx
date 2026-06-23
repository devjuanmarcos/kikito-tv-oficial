"use client";

import { Card } from "../card/Card";

import type { TiltCardProps } from "./tilt-card.types";

/** Backward-compat wrapper over the Super `Card` (`effect="tilt"`). */
export function TiltCard({
  children,
  maxTilt = 15,
  scale = 1.04,
  perspective = 800,
  glare = true,
  className,
  style,
}: TiltCardProps) {
  return (
    <Card
      effect="tilt"
      maxTilt={maxTilt}
      scale={scale}
      perspective={perspective}
      glare={glare}
      className={className}
      style={style}
    >
      {children}
    </Card>
  );
}
