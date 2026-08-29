import type React from "react";

export type FabIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
export type FabSize = "sm" | "md" | "lg";
// "inline" (absorvido do QuickActions): renderiza no fluxo normal do documento em vez de
// fixed num canto da tela — mesmo botão circular + speed-dial, sem tirar o layout do controle
// do consumidor. `placement` controla a direção de expansão nesse modo.
export type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "inline";
export type FabPlacement = "top" | "bottom" | "left" | "right";

export interface FabAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Cor da ação individual (absorvido do QuickActions) — default 'neutral' (raised/border, visual original do Fab). */
  intent?: FabIntent;
}

export interface FabProps {
  icon: React.ReactNode;
  actions?: FabAction[];
  position?: FabPosition;
  /** Direção de expansão das ações. Se omitido, é inferido de `position` (canto de baixo expande pra cima, canto de cima expande pra baixo); obrigatório fazer sentido só quando `position="inline"`. */
  placement?: FabPlacement;
  intent?: FabIntent;
  size?: FabSize;
  /** Nome acessível do botão principal. Se omitido, cai num fallback genérico ("Ação"/"Abrir menu") — recomendado sempre informar. */
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
