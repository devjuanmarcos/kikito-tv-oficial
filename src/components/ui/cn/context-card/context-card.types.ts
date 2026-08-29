import type React from "react";

export interface ContextCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  width?: number;
  /** Delay (ms) antes de abrir/fechar o popup — repassado pro `openDelay`/`closeDelay` do Tooltip subjacente. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}
