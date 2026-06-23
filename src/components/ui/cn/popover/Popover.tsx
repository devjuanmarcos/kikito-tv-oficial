"use client";
/**
 * Popover — backward-compat wrapper.
 * Absorbed by the Tooltip Super component (`<Tooltip trigger="click" />`). Kept so
 * existing imports of `Popover` keep working; new code should use Tooltip directly.
 */
import type React from "react";

import { Tooltip } from "@/components/ui/cn/tooltip";
import type { PopoverPlacement } from "@/components/ui/cn/tooltip/Tooltip";

export type { PopoverPlacement } from "@/components/ui/cn/tooltip/Tooltip";

export interface PopoverProps {
  content?: React.ReactNode;
  placement?: PopoverPlacement;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  showClose?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactElement;
}

export function Popover({ children, ...props }: PopoverProps) {
  return (
    <Tooltip trigger="click" {...props}>
      {children}
    </Tooltip>
  );
}
