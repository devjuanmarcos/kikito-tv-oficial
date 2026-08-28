import type { ComboboxOption, ComboboxProps as SelectComboboxProps } from "@/components/ui/cn/select/select.types";

export type ComboboxProps = Omit<SelectComboboxProps, "mode">;
export type { ComboboxOption };
