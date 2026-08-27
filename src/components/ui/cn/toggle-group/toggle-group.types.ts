import type React from "react";

export type ToggleGroupType = "single" | "multiple";
export type ToggleGroupVariant = "outline" | "solid" | "ghost";
export type ToggleGroupSize = "sm" | "md" | "lg";

export interface ToggleGroupItem {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  type?: ToggleGroupType;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Absorbed family: shared discriminated props ─────────────────────────── */

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupSegmentedProps<T extends string = string> {
  variant: "segmented";
  options: SegmentedControlOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: SegmentedControlSize;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type ChipGroupIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
export type ChipGroupSize = "sm" | "md" | "lg";

export interface ChipGroupChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupChipProps {
  variant: "chip";
  chips: ChipGroupChip[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  multiSelect?: boolean;
  intent?: ChipGroupIntent;
  size?: ChipGroupSize;
  className?: string;
  style?: React.CSSProperties;
}

export interface FilterBarOption {
  value: string;
  label: string;
  count?: number;
}

export interface ToggleGroupFilterProps {
  variant: "filter";
  options: FilterBarOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  multiSelect?: boolean;
  clearable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type ToggleGroupAllProps =
  | ToggleGroupProps
  | ToggleGroupSegmentedProps
  | ToggleGroupChipProps
  | ToggleGroupFilterProps;
