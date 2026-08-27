import type React from "react";

export type InputGroupSize = "sm" | "md" | "lg";

export interface InputGroupProps {
  children: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: InputGroupSize;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
