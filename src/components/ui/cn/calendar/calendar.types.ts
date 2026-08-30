import type React from "react";

import type { CalendarEvent as SuperCalendarEvent, DateRange } from "../date-picker/date-picker.types";

/** Re-exported from the Super DatePicker so the type stays identical. */
export type CalendarEvent = SuperCalendarEvent;
/** Re-exported from the Super DatePicker so the shape stays identical (start/end, both nullable). */
export type CalendarRange = DateRange;

interface CalendarBaseProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** @default "single" */
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

/** Dual-boundary range selection (click once for start, again for end). */
export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onChange?: (range: CalendarRange) => void;
}

/** Any number of independently toggleable dates. */
export interface CalendarMultipleProps extends CalendarBaseProps {
  mode: "multiple";
  value?: Date[];
  defaultValue?: Date[];
  onChange?: (dates: Date[]) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps | CalendarMultipleProps;
