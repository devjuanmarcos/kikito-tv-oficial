"use client";
/**
 * FilterBar — backward-compat wrapper.
 * Absorbed by the ToggleGroup Super component (`<ToggleGroup variant="filter" />`).
 * Kept so existing imports of `FilterBar` keep working; new code should use
 * ToggleGroup directly.
 */
import { ToggleGroup } from "@/components/ui/cn/toggle-group";
import type { ToggleGroupFilterProps } from "@/components/ui/cn/toggle-group/toggle-group.types";

import type { FilterBarProps } from "./filter-bar.types";

export function FilterBar(props: FilterBarProps) {
  return <ToggleGroup variant="filter" {...(props as ToggleGroupFilterProps)} />;
}
