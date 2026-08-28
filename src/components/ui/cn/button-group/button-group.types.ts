import type React from "react";

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: React.CSSProperties;
}
