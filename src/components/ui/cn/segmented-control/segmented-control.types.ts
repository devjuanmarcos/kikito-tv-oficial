import type {
  SegmentedControlOption,
  SegmentedControlSize,
  ToggleGroupSegmentedProps,
} from "@/components/ui/cn/toggle-group/toggle-group.types";

export type { SegmentedControlOption, SegmentedControlSize };

export type SegmentedControlProps<T extends string = string> = Omit<ToggleGroupSegmentedProps<T>, "variant">;
