import type React from "react";

export interface TextWaveProps {
  /** Texto puro — precisa ser string pra poder dividir em caracteres. */
  children: string;
  /** Segundos por ciclo de pulso de cada caractere. @default 1.2 */
  duration?: number;
  /** Atraso (em segundos) entre o início do pulso de um caractere e o do próximo. @default 0.05 */
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}
