import type { RichSelectOption, RichSelectProps as SelectRichProps } from "@/components/ui/cn/select/select.types";

export type RichSelectProps = Omit<SelectRichProps, "mode">;
export type { RichSelectOption };
