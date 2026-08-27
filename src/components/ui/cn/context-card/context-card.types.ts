import type React from "react";

export interface ContextCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  width?: number;
  /** @deprecated não implementado — a revelação é 100% via CSS (:hover/:focus-within), sem debounce por JS. Mantido só por compat de tipos. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}
