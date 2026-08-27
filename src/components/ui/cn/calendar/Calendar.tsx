"use client";

import { DatePicker } from "../date-picker/DatePicker";

import type { CalendarProps } from "./calendar.types";

/**
 * Calendar — backward-compat wrapper.
 *
 * The inline calendar-grid logic now lives in the Super `DatePicker`
 * (`<DatePicker mode="inline" />`). This wrapper preserves the original
 * `Calendar` API (value as `Date`, onChange emitting `Date`) so existing
 * imports keep working.
 */
export function Calendar({ value, defaultValue, onChange, events, onEventClick, className, style }: CalendarProps) {
  return (
    <DatePicker
      mode="inline"
      value={value}
      defaultValue={defaultValue}
      onChange={(d) => {
        if (d) onChange?.(d);
      }}
      events={events}
      onEventClick={onEventClick}
      className={className}
      style={style}
    />
  );
}
