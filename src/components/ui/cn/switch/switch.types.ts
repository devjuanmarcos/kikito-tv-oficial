import type React from "react";

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchIntent = "primary" | "secondary" | "success" | "destructive" | "warning" | "info";
export type SwitchLabelPosition = "left" | "right";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: SwitchSize;
  intent?: SwitchIntent;
  labelPosition?: SwitchLabelPosition;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
