import type React from "react";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxVariant = "square" | "rounded" | "circle";
export type CheckboxIntent = "primary" | "secondary" | "success" | "destructive" | "warning" | "info";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  intent?: CheckboxIntent;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
