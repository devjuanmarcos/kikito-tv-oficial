"use client";
/**
 * PhoneInput — backward-compat wrapper.
 * Absorbed by the Input Super component (`<Input type="phone" />`). Kept so
 * existing imports of `PhoneInput` keep working; new code should use Input.
 */
import { Input } from "@/components/ui/cn/input";

import type { PhoneInputProps } from "./phone-input.types";

export function PhoneInput(props: PhoneInputProps) {
  return <Input type="phone" {...props} />;
}
