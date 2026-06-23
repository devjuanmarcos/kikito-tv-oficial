"use client";
/**
 * RatingInput — backward-compat wrapper.
 * Absorbed by the Rating Super component. RatingInput was the picker variant
 * with text-star icons and click-to-toggle-off; that maps to
 * `<Rating toggleOff icon="★" emptyIcon="☆" />`. New code should use Rating.
 */
import type React from "react";

import { Rating } from "@/components/ui/cn/rating";
import type { RatingSize } from "@/components/ui/cn/rating/rating.types";

export type RatingInputSize = RatingSize;

export interface RatingInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: RatingInputSize;
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function RatingInput({ icon = "★", emptyIcon = "☆", ...props }: RatingInputProps) {
  return <Rating toggleOff icon={icon} emptyIcon={emptyIcon} {...props} />;
}
