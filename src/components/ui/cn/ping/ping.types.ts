import type React from "react";

export type PingIntent = "primary" | "success" | "warning" | "danger" | "info" | "neutral";
export type PingSize = "sm" | "md" | "lg";

export interface PingProps {
  intent?: PingIntent;
  size?: PingSize;
  animate?: boolean;
  /** Nome acessível do ponto de status (leitor de tela). Sem isso, o ponto é puramente decorativo. */
  label?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
