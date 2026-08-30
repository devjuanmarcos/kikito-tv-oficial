import type React from "react";

export type BadgeVariant = "solid" | "outline" | "soft" | "ghost" | "dot";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeRounded = "none" | "sm" | "md" | "lg" | "full";
export type BadgeIntent = "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  intent?: BadgeIntent;
  rounded?: BadgeRounded;
  dot?: boolean;
  dismissible?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onDismiss?: () => void;
  /**
   * Status assíncrono: glow ambiente pulsante + ícone com pop-in + rótulo revelado
   * letra-por-letra (children precisa ser string pra stagger funcionar; outros tipos de
   * children ainda recebem o glow, só sem o stagger). Pensado pra badge remontada
   * (`key={status}`) a cada transição pending→success/error, não um loop contínuo.
   */
  animated?: boolean;
}
