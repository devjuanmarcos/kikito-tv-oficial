import type React from "react";

import type { MenuEntry } from "@/components/ui/cn/dropdown-menu";

export interface MenubarMenuDef {
  label: string;
  items: MenuEntry[];
  disabled?: boolean;
}

export interface MenubarProps {
  menus: MenubarMenuDef[];
  className?: string;
  style?: React.CSSProperties;
}
