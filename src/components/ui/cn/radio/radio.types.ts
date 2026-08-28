import type React from "react";

export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps {
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
  label?: string;
  helperText?: string;
  size?: RadioSize;
  disabled?: boolean;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  helperText?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  helperText?: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  size?: RadioSize;
  disabled?: boolean;
  name?: string;
  className?: string;
}
