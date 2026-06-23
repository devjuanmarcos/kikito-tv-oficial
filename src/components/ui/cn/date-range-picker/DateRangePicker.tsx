"use client";

import { DatePicker } from "../date-picker/DatePicker";

import type { DateRangePickerProps } from "./date-range-picker.types";

/**
 * DateRangePicker — backward-compat wrapper.
 *
 * The dual-calendar range logic now lives in the Super `DatePicker`
 * (`<DatePicker range />`). This wrapper preserves the original API/type
 * surface so existing imports keep working.
 */
export function DateRangePicker(props: DateRangePickerProps) {
  return <DatePicker range {...props} />;
}
