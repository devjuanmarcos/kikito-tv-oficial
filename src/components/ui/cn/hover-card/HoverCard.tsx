"use client";
/**
 * HoverCard — backward-compat wrapper.
 * Absorbed by the Tooltip Super component (`<Tooltip variant="card" />`). Kept so
 * existing imports of `HoverCard` keep working; new code should use Tooltip directly.
 */
import { Tooltip } from "@/components/ui/cn/tooltip";

import type { HoverCardProps } from "./hover-card.types";

export function HoverCard({ children, ...props }: HoverCardProps) {
  return (
    <Tooltip variant="card" {...props}>
      {children}
    </Tooltip>
  );
}
