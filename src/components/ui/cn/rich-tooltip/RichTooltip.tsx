"use client";
/**
 * RichTooltip — backward-compat wrapper.
 * Absorbed by the Tooltip Super component (`<Tooltip variant="rich" />`). Kept so
 * existing imports of `RichTooltip` keep working; new code should use Tooltip directly.
 */
import { Tooltip } from "@/components/ui/cn/tooltip";

import type { RichTooltipProps } from "./rich-tooltip.types";

export function RichTooltip(props: RichTooltipProps) {
  return <Tooltip variant="rich" {...props} />;
}
