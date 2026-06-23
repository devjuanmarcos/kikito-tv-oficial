"use client";
/**
 * ChipGroup — backward-compat wrapper.
 * Absorbed by the ToggleGroup Super component (`<ToggleGroup variant="chip" />`).
 * Kept so existing imports of `ChipGroup` keep working; new code should use
 * ToggleGroup directly.
 */
import { ToggleGroup } from "@/components/ui/cn/toggle-group";
import type {
  ToggleGroupChipProps,
  ChipGroupChip,
  ChipGroupIntent,
  ChipGroupSize,
} from "@/components/ui/cn/toggle-group/ToggleGroup";

export type { ChipGroupChip, ChipGroupIntent, ChipGroupSize };

export type ChipGroupProps = Omit<ToggleGroupChipProps, "variant">;

export function ChipGroup(props: ChipGroupProps) {
  return <ToggleGroup variant="chip" {...props} />;
}
