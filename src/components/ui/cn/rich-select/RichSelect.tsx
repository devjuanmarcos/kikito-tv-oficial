"use client";
/**
 * RichSelect — backward-compat wrapper.
 * Absorbed by the Select Super component (`<Select mode="rich" />`). Kept so
 * existing imports of `RichSelect` keep working; new code should use Select.
 */
import { Select } from "@/components/ui/cn/select";
import type { RichSelectProps as SelectRichProps } from "@/components/ui/cn/select/Select";

export type RichSelectProps = Omit<SelectRichProps, "mode">;

export function RichSelect(props: RichSelectProps) {
  return <Select mode="rich" {...props} />;
}
