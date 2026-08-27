import type React from "react";

import type { CalendarEvent as SuperCalendarEvent } from "../date-picker/date-picker.types";

/** Re-exported from the Super DatePicker so the type stays identical. */
export type CalendarEvent = SuperCalendarEvent;

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}
