"use client";
import type React from "react";

import { DatePicker, type CalendarEvent as SuperCalendarEvent } from "../date-picker/DatePicker";

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
