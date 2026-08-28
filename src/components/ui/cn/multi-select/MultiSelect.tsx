"use client";
/**
 * MultiSelect — backward-compat wrapper.
 * Absorbed by the Select Super component (`<Select mode="multi" />`). Kept so
 * existing imports of `MultiSelect` keep working; new code should use Select.
 */
import { Select } from "@/components/ui/cn/select";

import type { MultiSelectProps } from "./multi-select.types";

export function MultiSelect(props: MultiSelectProps) {
  return <Select mode="multi" {...props} />;
}
