import type React from "react";

export type RadioSize = "sm" | "md" | "lg";
export type RadioVariant = "default" | "card";

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
  /** @default "default" */
  variant?: RadioVariant;
  /** variant="card": icon shown above the label. */
  icon?: React.ReactNode;
  /** variant="card": longer description below the label (helperText still works as a shorter caption). */
  description?: string;
  /** variant="card": price/value shown aligned to the right of the label (e.g. a plan price). */
  price?: string;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  helperText?: string;
  disabled?: boolean;
  /** variant="card": icon shown above the label. */
  icon?: React.ReactNode;
  /** variant="card": longer description below the label. */
  description?: string;
  /** variant="card": price/value shown aligned to the right of the label. */
  price?: string;
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
  /** "card" renders each option as a clickable card (icon/description/price) instead of a dot+label row. @default "default" */
  variant?: RadioVariant;
}
