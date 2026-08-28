import type React from "react";

export type FloatingBarPosition = "bottom" | "top";

export interface FloatingBarProps {
  children: React.ReactNode;
  position?: FloatingBarPosition;
  visible?: boolean;
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
