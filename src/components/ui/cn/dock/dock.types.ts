import type React from "react";

export interface DockApp {
  id: string;
  name: string;
  /** Conteúdo do ícone — qualquer ReactNode (img, svg, emoji). */
  icon: React.ReactNode;
}

export interface DockProps {
  apps: DockApp[];
  /** IDs dos apps atualmente abertos — mostra o dot indicador embaixo do ícone. */
  openApps?: string[];
  onAppClick?: (appId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
