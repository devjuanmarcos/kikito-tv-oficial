import type React from "react";

export type CardVariant = "default" | "outlined" | "elevated" | "filled" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardRadius = "sm" | "md" | "lg" | "xl";
export type CardEffect = "none" | "glass" | "glow" | "tilt" | "spotlight" | "gradient-border";
export type CardGradientBorderVariant = "spin" | "pulse" | "static";

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  hoverable?: boolean;
  clickable?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;

  /** Visual effect dispatch. Default `none` keeps the standard card. */
  effect?: CardEffect;

  /* effect=glass */
  blur?: number;
  opacity?: number;
  border?: boolean;

  /* effect=glow */
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;

  /* effect=tilt */
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  glare?: boolean;

  /* effect=spotlight */
  color?: string;
  size?: number;

  /* effect=gradient-border */
  colors?: string[];
  borderWidth?: number;
  borderRadius?: number;
  speed?: number;
  gradientVariant?: CardGradientBorderVariant;
  /** Numeric corner radius shared by glow/gradient-border effects. */
  effectRadius?: number;
  /** Inner padding for glow effect. */
  effectPadding?: number | string;
}

export interface CardHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  noPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface CardFooterProps {
  align?: "left" | "right" | "center" | "between";
  separator?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
