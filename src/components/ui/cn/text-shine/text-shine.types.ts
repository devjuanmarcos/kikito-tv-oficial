import type React from "react";

export type TextShineAs = "span" | "h1" | "h2" | "h3" | "h4" | "p";

export interface TextShineProps {
  children: React.ReactNode;
  /** Segundos por ciclo do brilho. @default 4 */
  duration?: number;
  as?: TextShineAs;
  className?: string;
  style?: React.CSSProperties;
}
