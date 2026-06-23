"use client";

import { Card } from "../card/Card";

import type { SpotlightProps } from "./spotlight.types";

/** Backward-compat wrapper over the Super `Card` (`effect="spotlight"`). */
export function Spotlight({ children, color = "var(--ks-violet-soft)", size = 300, className, style }: SpotlightProps) {
  return (
    <Card effect="spotlight" color={color} size={size} className={className} style={style}>
      {children}
    </Card>
  );
}
