"use client";
/**
 * NumberInput — backward-compat wrapper.
 * Absorbed by the Input Super component (`<Input type="number" />`). Kept so
 * existing imports of `NumberInput` keep working; new code should use Input.
 */
import type React from "react";

import { Input } from "@/components/ui/cn/input";

export type NumberInputSize = "sm" | "md" | "lg";
export type NumberInputVariant = "default" | "ghost" | "filled";

export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowDecimal?: boolean;
  format?: (value: number) => string;
  parse?: (value: string) => number;
  size?: NumberInputSize;
  variant?: NumberInputVariant;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function NumberInput(props: NumberInputProps) {
  return <Input type="number" {...props} />;
}
