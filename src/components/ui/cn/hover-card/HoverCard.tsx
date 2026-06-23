"use client";
/**
 * HoverCard — backward-compat wrapper.
 * Absorbed by the Tooltip Super component (`<Tooltip variant="card" />`). Kept so
 * existing imports of `HoverCard` keep working; new code should use Tooltip directly.
 */
import type React from "react";

import { Tooltip } from "@/components/ui/cn/tooltip";
import type { HoverCardSide, HoverCardAlign } from "@/components/ui/cn/tooltip/Tooltip";

export type { HoverCardSide, HoverCardAlign } from "@/components/ui/cn/tooltip/Tooltip";

export interface HoverCardProps {
  content: React.ReactNode;
  side?: HoverCardSide;
  align?: HoverCardAlign;
  openDelay?: number;
  closeDelay?: number;
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
}

export function HoverCard({ children, ...props }: HoverCardProps) {
  return (
    <Tooltip variant="card" {...props}>
      {children}
    </Tooltip>
  );
}
