"use client";

import { DropdownMenu } from "@/components/ui/cn/dropdown-menu";
import type { MenuEntry } from "@/components/ui/cn/dropdown-menu/dropdown-menu.types";
import { cn } from "@/lib/utils";

import type { ContextMenuProps } from "./context-menu.types";

/**
 * ContextMenu — backward-compat wrapper over the Super `DropdownMenu`
 * (`trigger="contextmenu"`). Kept for existing call sites; new code should
 * prefer `<DropdownMenu trigger="contextmenu" />`.
 */
export function ContextMenu({ groups, children, className, style }: ContextMenuProps) {
  const items: MenuEntry[] = groups.map((group) => ({
    type: "group" as const,
    label: group.label ?? "",
    items: group.items.map((it, i) => ({
      type: "item" as const,
      value: String(i),
      label: it.label,
      icon: it.icon,
      shortcut: it.shortcut,
      disabled: it.disabled,
      danger: it.danger,
      onClick: it.onClick,
    })),
  }));

  return (
    <DropdownMenu trigger="contextmenu" items={items}>
      <div className={cn("contents", className)} style={style}>
        {children}
      </div>
    </DropdownMenu>
  );
}
