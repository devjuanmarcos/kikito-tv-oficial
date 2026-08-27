import type React from "react";

export type DatePickerVariant = "outline" | "filled" | "ghost";

/* ── Shared sub-types absorbed from sibling families ──────────────────────── */

/** Range value shape (absorbed from DateRangePicker). */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** Time value shape (absorbed from TimePicker). */
export interface TimeValue {
  hours: number;
  minutes: number;
  period?: "AM" | "PM";
}
export type TimeFormat = "12" | "24";

/** Inline-calendar event shape (absorbed from Calendar). */
export interface CalendarEvent {
  id: string | number;
  date: Date;
  title: string;
  color?: string;
}

/* ── Discriminated props union ────────────────────────────────────────────── */

interface DatePickerBaseProps {
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: "default" | "error";
  disabled?: boolean;
  clearable?: boolean;
  showTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  formatDate?: (d: Date) => string;
  locale?: string;
  className?: string;
}

/** Default single-date input mode. */
export interface DatePickerSingleProps extends DatePickerBaseProps {
  /** Dual-calendar range mode. Omit/false for a single date. */
  range?: false;
  /** `input` (default, popover field) or `inline` (always-open calendar grid). */
  mode?: "input" | "inline";
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  /** Inline-mode events (absorbed from Calendar). */
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
}

/** Date-range mode (absorbed from DateRangePicker). value is `{ start, end }`. */
export interface DatePickerRangeProps extends DatePickerBaseProps {
  range: true;
  mode?: "input";
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  style?: React.CSSProperties;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;
