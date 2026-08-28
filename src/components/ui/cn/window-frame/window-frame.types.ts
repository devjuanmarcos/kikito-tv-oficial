import type React from "react";

export type WindowFrameVariant = "macos" | "windows" | "minimal";

export interface WindowFrameProps {
  children: React.ReactNode;
  variant?: WindowFrameVariant;
  title?: string;
  url?: string;
  className?: string;
  style?: React.CSSProperties;
}
