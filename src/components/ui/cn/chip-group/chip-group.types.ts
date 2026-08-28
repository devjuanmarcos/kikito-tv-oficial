import type {
  ToggleGroupChipProps,
  ChipGroupChip,
  ChipGroupIntent,
  ChipGroupSize,
} from "@/components/ui/cn/toggle-group/toggle-group.types";

export type { ChipGroupChip, ChipGroupIntent, ChipGroupSize };

export type ChipGroupProps = Omit<ToggleGroupChipProps, "variant">;
