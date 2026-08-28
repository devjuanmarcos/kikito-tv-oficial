import type React from "react";

export interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number;
  className?: string;
  style?: React.CSSProperties;
}
