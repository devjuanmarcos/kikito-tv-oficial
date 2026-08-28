import type React from "react";

import type { HoverCardAlign, HoverCardSide } from "@/components/ui/cn/tooltip/tooltip.types";

export type { HoverCardSide, HoverCardAlign };

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
