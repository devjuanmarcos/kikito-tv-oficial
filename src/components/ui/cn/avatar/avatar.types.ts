import type React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarVariant = "circle" | "rounded" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy" | "none";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  icon?: React.ReactNode;
  size?: AvatarSize;
  variant?: AvatarVariant;
  status?: AvatarStatus;
  /** Torna o avatar clicável (vira <button>, ganha micro-interação de hover/tap). Sem isso, continua <span> puramente decorativo. */
  onClick?: () => void;
  /** Estado selecionado — só tem efeito quando `onClick` está presente (avatar clicável). */
  selected?: boolean;
  /** Nome acessível do botão quando clicável. Recomendado informar sempre que `onClick` for usado. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface AvatarGroupProps {
  size?: AvatarSize;
  max?: number;
  children: React.ReactNode;
  className?: string;
}
