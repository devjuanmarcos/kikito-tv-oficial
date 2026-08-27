import type React from "react";

import type { DateRange as SuperDateRange } from "../date-picker/date-picker.types";

/** Re-exported from the Super DatePicker so the type stays identical. */
export type DateRange = SuperDateRange;

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
