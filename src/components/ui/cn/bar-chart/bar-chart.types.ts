import type React from "react";

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  /** Largura total do SVG — só usado em orientation="horizontal" (reserva espaço pro label + trilha da barra). */
  width?: number;
  barWidth?: number;
  gap?: number;
  showValues?: boolean;
  showBaseline?: boolean;
  color?: string;
  animate?: boolean;
  /** @default "vertical" */
  orientation?: "vertical" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
}
