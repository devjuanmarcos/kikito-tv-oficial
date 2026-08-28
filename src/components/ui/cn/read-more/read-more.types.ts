import type React from "react";

export interface ReadMoreProps {
  children: string;
  maxLength?: number;
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
