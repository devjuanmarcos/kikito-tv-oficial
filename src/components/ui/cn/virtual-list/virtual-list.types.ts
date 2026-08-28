import type React from "react";

export interface VirtualListProps<T = unknown> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  /** Nome acessível do viewport de scroll (leitor de tela). */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
