import type React from "react";

export type AlertIntent = "info" | "success" | "warning" | "danger" | "neutral";
export type AlertVariant = "soft" | "outline" | "solid" | "left-accent";
export type AlertSize = "sm" | "md" | "lg";

export interface AlertProps {
  intent?: AlertIntent;
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  size?: AlertSize;
  className?: string;
  style?: React.CSSProperties;
}
