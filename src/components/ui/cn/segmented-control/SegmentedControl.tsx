"use client";
/**
 * SegmentedControl — backward-compat wrapper.
 * Absorbed by the ToggleGroup Super component (`<ToggleGroup variant="segmented" />`).
 * Kept so existing imports of `SegmentedControl` keep working; new code should use
 * ToggleGroup directly.
 */
import { ToggleGroup } from "@/components/ui/cn/toggle-group";
import type { ToggleGroupSegmentedProps } from "@/components/ui/cn/toggle-group/toggle-group.types";

import type { SegmentedControlProps } from "./segmented-control.types";

export function SegmentedControl<T extends string = string>(props: SegmentedControlProps<T>) {
  return <ToggleGroup variant="segmented" {...(props as ToggleGroupSegmentedProps<string>)} />;
}
