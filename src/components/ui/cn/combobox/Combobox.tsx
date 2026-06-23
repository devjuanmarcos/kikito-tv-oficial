"use client";
/**
 * Combobox — backward-compat wrapper.
 * Absorbed by the Select Super component (`<Select mode="combobox" />`). Kept so
 * existing imports of `Combobox` keep working; new code should use Select.
 */
import { Select } from "@/components/ui/cn/select";
import type { ComboboxProps as SelectComboboxProps, ComboboxOption } from "@/components/ui/cn/select/Select";

export type ComboboxProps = Omit<SelectComboboxProps, "mode">;
export type { ComboboxOption };

export function Combobox(props: ComboboxProps) {
  return <Select mode="combobox" {...props} />;
}
