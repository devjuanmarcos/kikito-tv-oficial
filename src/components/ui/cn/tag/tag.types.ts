import type React from "react";

export type TagIntent = "primary" | "info" | "success" | "warning" | "danger" | "neutral";
export type TagAppearance = "soft" | "solid" | "outline";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
  intent?: TagIntent;
  appearance?: TagAppearance;
  size?: TagSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}
