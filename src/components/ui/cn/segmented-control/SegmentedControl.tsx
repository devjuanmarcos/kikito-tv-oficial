"use client";
/**
 * SegmentedControl — backward-compat wrapper.
 * Absorbed by the ToggleGroup Super component (`<ToggleGroup variant="segmented" />`).
 * Kept so existing imports of `SegmentedControl` keep working; new code should use
 * ToggleGroup directly.
 */
import { ToggleGroup } from "@/components/ui/cn/toggle-group";
import type { ToggleGroupSegmentedProps, SegmentedControlOption } from "@/components/ui/cn/toggle-group/ToggleGroup";

export type { SegmentedControlOption };

export type SegmentedControlProps<T extends string = string> = Omit<ToggleGroupSegmentedProps<T>, "variant">;

export function SegmentedControl<T extends string = string>(props: SegmentedControlProps<T>) {
  return <ToggleGroup variant="segmented" {...(props as ToggleGroupSegmentedProps<string>)} />;
}
