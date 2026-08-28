"use client";
/**
 * Popover — backward-compat wrapper.
 * Absorbed by the Tooltip Super component (`<Tooltip trigger="click" />`). Kept so
 * existing imports of `Popover` keep working; new code should use Tooltip directly.
 */
import { Tooltip } from "@/components/ui/cn/tooltip";

import type { PopoverProps } from "./popover.types";

export function Popover({ children, ...props }: PopoverProps) {
  return (
    <Tooltip trigger="click" {...props}>
      {children}
    </Tooltip>
  );
}
