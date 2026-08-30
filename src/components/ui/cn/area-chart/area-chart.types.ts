import type React from "react";

export interface AreaChartDataPoint {
  label: string;
  [series: string]: number | string;
}

export interface AreaChartSeries {
  key: string;
  label?: string;
  color?: string;
}

/** Interpolacao em degrau nativa do ECharts (line series `step`), em vez de reta entre pontos. */
export type AreaChartStep = "start" | "middle" | "end";

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  series: AreaChartSeries[];
  height?: number;
  showGrid?: boolean;
  showDots?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
  gradient?: boolean;
  /** Interpolacao em degrau (nativa do ECharts) em vez de reta entre pontos. */
  step?: AreaChartStep;
  className?: string;
  style?: React.CSSProperties;
}
