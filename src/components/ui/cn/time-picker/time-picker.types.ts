import type React from "react";

export type TimeFormat = "12" | "24";

export interface TimeValue {
  hours: number;
  minutes: number;
  period?: "AM" | "PM";
}

export interface TimePickerProps {
  value?: TimeValue;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue) => void;
  format?: TimeFormat;
  minuteStep?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
