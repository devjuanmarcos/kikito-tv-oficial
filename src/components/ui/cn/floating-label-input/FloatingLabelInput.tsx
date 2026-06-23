"use client";
/**
 * FloatingLabelInput — backward-compat wrapper.
 * Absorbed by the Input Super component (`<Input floatingLabel />`). Kept so
 * existing imports of `FloatingLabelInput` keep working; new code should use Input.
 */
import type React from "react";

import { Input } from "@/components/ui/cn/input";
import type { InputVariant } from "@/components/ui/cn/input";

export type FloatingLabelVariant = "outline" | "filled" | "underline";
export type FloatingLabelSize = "sm" | "md" | "lg";

export interface FloatingLabelInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  id?: string;
  variant?: FloatingLabelVariant;
  size?: FloatingLabelSize;
  invalid?: boolean;
  hint?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Maps the floating-label variant scale (outline|filled|underline) onto the
 *  Super Input `variant` so the absorbed impl reconstructs the same visual. */
const VARIANT_MAP: Record<FloatingLabelVariant, InputVariant> = {
  outline: "outline",
  filled: "filled",
  underline: "flushed",
};

export function FloatingLabelInput({ variant = "outline", invalid, errorMessage, ...props }: FloatingLabelInputProps) {
  return (
    <Input
      floatingLabel
      variant={VARIANT_MAP[variant]}
      status={invalid ? "error" : undefined}
      error={errorMessage}
      {...props}
    />
  );
}
