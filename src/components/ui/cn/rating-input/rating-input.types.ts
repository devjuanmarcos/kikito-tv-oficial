import type React from "react";

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
