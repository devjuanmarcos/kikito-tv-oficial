import type React from "react";

export type SparklineType = "line" | "bar" | "area";

export interface SparklineProps {
  data: number[];
  type?: SparklineType;
  width?: number;
  height?: number;
  color?: string;
  intent?: "primary" | "success" | "warning" | "danger" | "neutral";
  strokeWidth?: number;
  filled?: boolean;
  /** Nome acessível do gráfico (leitor de tela). Sem isso, um resumo genérico é gerado a partir de `data`. */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
