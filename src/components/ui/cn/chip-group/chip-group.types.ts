import type {
  ToggleGroupChipProps,
  ChipGroupChip,
  ChipGroupIntent,
  ChipGroupSize,
} from "@/components/ui/cn/toggle-group/ToggleGroup";

export type { ChipGroupChip, ChipGroupIntent, ChipGroupSize };

export type ChipGroupProps = Omit<ToggleGroupChipProps, "variant">;
