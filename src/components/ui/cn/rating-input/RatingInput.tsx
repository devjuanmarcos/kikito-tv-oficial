"use client";
/**
 * RatingInput — backward-compat wrapper.
 * Absorbed by the Rating Super component. RatingInput was the picker variant
 * with text-star icons and click-to-toggle-off; that maps to
 * `<Rating toggleOff icon="★" emptyIcon="☆" />`. New code should use Rating.
 */
import { Rating } from "@/components/ui/cn/rating";

import type { RatingInputProps } from "./rating-input.types";

export function RatingInput({ icon = "★", emptyIcon = "☆", ...props }: RatingInputProps) {
  return <Rating toggleOff icon={icon} emptyIcon={emptyIcon} {...props} />;
}
