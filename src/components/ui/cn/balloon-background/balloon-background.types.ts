import type React from "react";

export interface BalloonColorSet {
  base: string;
  light: string;
  dark: string;
}

export interface BalloonBackgroundProps {
  children?: React.ReactNode;
  /** Quantos balões flutuam ao mesmo tempo. @default 30 */
  balloonCount?: number;
  /** Paleta de cores dos balões (sorteada por balão). */
  colors?: BalloonColorSet[];
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}
