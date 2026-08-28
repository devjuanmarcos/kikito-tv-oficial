import type React from "react";

import type { PopoverPlacement } from "@/components/ui/cn/tooltip/tooltip.types";

export type { PopoverPlacement };

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
