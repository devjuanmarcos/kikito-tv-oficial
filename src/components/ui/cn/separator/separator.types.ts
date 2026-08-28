import type React from "react";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "solid" | "dashed" | "dotted";
export type SeparatorSpacing = "xs" | "sm" | "md" | "lg" | "xl";
export type SeparatorLabelAlign = "start" | "center" | "end";

export interface SeparatorProps {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  label?: React.ReactNode;
  labelAlign?: SeparatorLabelAlign;
  spacing?: SeparatorSpacing;
  decorative?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
