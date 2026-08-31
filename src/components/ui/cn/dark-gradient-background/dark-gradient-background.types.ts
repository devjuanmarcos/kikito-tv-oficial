import type React from "react";

export interface DarkGradientBackgroundProps {
  children?: React.ReactNode;
  /** Cor dos feixes diagonais decorativos. @default "var(--ks-info)" */
  streakColor?: string;
  className?: string;
  style?: React.CSSProperties;
}
