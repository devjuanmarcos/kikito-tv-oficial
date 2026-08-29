import type React from "react";

export interface RadialBarSegment {
  label: string;
  value: number;
  color?: string;
}

export interface RadialBarChartProps {
  segments: RadialBarSegment[];
  size?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
