"use client";
/**
 * RangeSlider — backward-compat wrapper.
 * Absorbed by the Slider Super component (`<Slider range />`). Kept so existing
 * imports of `RangeSlider` keep working; new code should use Slider directly.
 */
import { Slider } from "@/components/ui/cn/slider";
import type { SliderRangeProps } from "@/components/ui/cn/slider/slider.types";

export type RangeSliderProps = Omit<SliderRangeProps, "range">;

export function RangeSlider(props: RangeSliderProps) {
  return <Slider range {...props} />;
}
