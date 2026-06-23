"use client";

import { Card } from "../card/Card";

import type { GradientBorderProps } from "./gradient-border.types";

const DEFAULT_COLORS = ["var(--ks-violet)", "var(--ks-primary)", "var(--ks-kinpaku)", "var(--ks-rose)"];

/** Backward-compat wrapper over the Super `Card` (`effect="gradient-border"`). */
export function GradientBorder({
  children,
  colors = DEFAULT_COLORS,
  borderWidth = 2,
  borderRadius = 12,
  speed = 3,
  variant = "spin",
  className,
  style,
}: GradientBorderProps) {
  return (
    <Card
      effect="gradient-border"
      colors={colors}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      speed={speed}
      gradientVariant={variant}
      className={className}
      style={style}
    >
      {children}
    </Card>
  );
}
