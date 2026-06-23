"use client";
/**
 * MultiSelect — backward-compat wrapper.
 * Absorbed by the Select Super component (`<Select mode="multi" />`). Kept so
 * existing imports of `MultiSelect` keep working; new code should use Select.
 */
import { Select } from "@/components/ui/cn/select";
import type { MultiSelectProps as SelectMultiProps } from "@/components/ui/cn/select/Select";

export type MultiSelectProps = Omit<SelectMultiProps, "mode">;

export function MultiSelect(props: MultiSelectProps) {
  return <Select mode="multi" {...props} />;
}
