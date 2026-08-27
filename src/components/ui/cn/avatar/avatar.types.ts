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
  className?: string;
  style?: React.CSSProperties;
}

export interface AvatarGroupProps {
  size?: AvatarSize;
  max?: number;
  children: React.ReactNode;
  className?: string;
}
