"use client";
/**
 * Combobox — backward-compat wrapper.
 * Absorbed by the Select Super component (`<Select mode="combobox" />`). Kept so
 * existing imports of `Combobox` keep working; new code should use Select.
 */
import { Select } from "@/components/ui/cn/select";

import type { ComboboxProps } from "./combobox.types";

export function Combobox(props: ComboboxProps) {
  return <Select mode="combobox" {...props} />;
}
