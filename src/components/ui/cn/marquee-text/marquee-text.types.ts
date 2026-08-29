import type React from "react";

export interface MarqueeTextProps {
  text: string;
  speed?: number;
  size?: "sm" | "md" | "lg" | "xl";
  repeat?: number;
  className?: string;
  style?: React.CSSProperties;
}
