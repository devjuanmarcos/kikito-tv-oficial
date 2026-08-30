import type React from "react";

export interface LineChartSeries {
  label: string;
  data: number[];
  color?: string;
}

/** Linha horizontal de meta/media com rotulo (ex.: "Meta: 80"). */
export interface LineChartReferenceLine {
  value: number;
  label?: string;
  color?: string;
}

/** Interpolacao em degrau nativa do ECharts (line series `step`), em vez de reta entre pontos. */
export type LineChartStep = "start" | "middle" | "end";

export interface LineChartProps {
  series: LineChartSeries[];
  labels?: string[];
  height?: number;
  width?: number | string;
  showArea?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  /** Linha horizontal de meta/media com rotulo, desenhada via markLine nativo do ECharts. */
  referenceLine?: LineChartReferenceLine;
  /** Interpolacao em degrau (nativa do ECharts) em vez de reta entre pontos. */
  step?: LineChartStep;
  className?: string;
  style?: React.CSSProperties;
}
