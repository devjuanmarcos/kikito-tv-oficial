import type React from "react";

export type RibbonIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
export type RibbonPosition = "top-right" | "top-left";

export interface RibbonProps {
  children: React.ReactNode;
  label: string;
  position?: RibbonPosition;
  intent?: RibbonIntent;
  className?: string;
  style?: React.CSSProperties;
}
