import type {
  MultiSelectOption,
  MultiSelectProps as SelectMultiProps,
  MultiSelectSize,
} from "@/components/ui/cn/select/select.types";

export type MultiSelectProps = Omit<SelectMultiProps, "mode">;
export type { MultiSelectOption, MultiSelectSize };
