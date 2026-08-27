import type React from "react";

export type FabIntent = "primary" | "secondary" | "success" | "danger" | "neutral";
export type FabSize = "sm" | "md" | "lg";
export type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface FabAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface FabProps {
  icon: React.ReactNode;
  actions?: FabAction[];
  position?: FabPosition;
  intent?: FabIntent;
  size?: FabSize;
  /** Nome acessível do botão principal. Se omitido, cai num fallback genérico ("Ação"/"Abrir menu") — recomendado sempre informar. */
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
