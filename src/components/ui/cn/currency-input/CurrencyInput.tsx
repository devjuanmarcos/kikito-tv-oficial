"use client";
/**
 * CurrencyInput — backward-compat wrapper.
 * Absorbed by the Input Super component (`<Input type="currency" />`). Kept so
 * existing imports of `CurrencyInput` keep working; new code should use Input.
 */
import { Input } from "@/components/ui/cn/input";

import type { CurrencyInputProps } from "./currency-input.types";

export function CurrencyInput(props: CurrencyInputProps) {
  return <Input type="currency" {...props} />;
}
