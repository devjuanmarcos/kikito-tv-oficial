import type React from "react";

export type SplitButtonIntent = "primary" | "secondary" | "success" | "danger" | "neutral";
export type SplitButtonSize = "sm" | "md" | "lg";

export interface SplitButtonOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  label: string;
  onClick: () => void;
  options: SplitButtonOption[];
  intent?: SplitButtonIntent;
  size?: SplitButtonSize;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
