import type React from "react";

export type IconBoxIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
export type IconBoxVariant = "soft" | "solid" | "outline";
export type IconBoxSize = "sm" | "md" | "lg";

export interface IconBoxProps {
  icon: React.ReactNode;
  intent?: IconBoxIntent;
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}
