import type React from "react";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps {
  children: React.ReactNode;
  orientation?: ScrollAreaOrientation;
  maxHeight?: number | string;
  maxWidth?: number | string;
  /**
   * Aplica um fade nas bordas via `mask-image` (efeito "vanish" comum em
   * scrollers/carrosséis). Só tem efeito com `orientation="vertical"` ou
   * `"horizontal"` — `"both"` não aplica (composição dos dois gradientes de
   * máscara não vale a complexidade cross-browser pra esse caso raro).
   */
  fadeEdges?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
