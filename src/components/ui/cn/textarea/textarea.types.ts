import type React from "react";

export type TextareaVariant = "outline" | "filled" | "ghost";
export type TextareaSize = "sm" | "md" | "lg";
export type TextareaState = "default" | "error" | "success" | "warning";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  state?: TextareaState;
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  warningText?: string;
  showCount?: boolean;
  autoResize?: boolean;
  maxRows?: number;
  resize?: TextareaResize;
  /** Renders a floating label (parity with `Input.floatingLabel`) instead of a static label above the field. */
  floatingLabel?: boolean;
  className?: string;
}
