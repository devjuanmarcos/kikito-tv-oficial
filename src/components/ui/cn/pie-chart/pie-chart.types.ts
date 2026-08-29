import type React from "react";

export interface PieSegment {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  segments: PieSegment[];
  size?: number;
  showLegend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
