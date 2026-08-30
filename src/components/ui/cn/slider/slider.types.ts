import type React from "react";

export type SliderSize = "sm" | "md" | "lg";
export type SliderIntent = "primary" | "info" | "success" | "warning" | "danger";

export interface SliderMark {
  value: number;
  label?: string;
}

interface SliderCommon {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (v: number) => string;
  size?: SliderSize;
  intent?: SliderIntent;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface SliderSingleProps extends SliderCommon {
  /** Dual-thumb range mode. Omit/false for a single-value slider. */
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  marks?: SliderMark[];
  /** Highlights the segment between the current value and the cursor position while hovering the track, before clicking/dragging. */
  previewOnHover?: boolean;
}

export interface SliderRangeProps extends SliderCommon {
  range: true;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  showValues?: boolean;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;
