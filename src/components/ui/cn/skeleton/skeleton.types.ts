import type React from "react";

export type SkeletonShape = "default" | "circle" | "rounded" | "pill";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  shape?: SkeletonShape;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
