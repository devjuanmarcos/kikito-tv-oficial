"use client";

import { DropdownMenu } from "@/components/ui/cn/dropdown-menu";
import type { MenuEntry } from "@/components/ui/cn/dropdown-menu/dropdown-menu.types";

import type { FloatingMenuProps } from "./floating-menu.types";

/**
 * FloatingMenu — backward-compat wrapper over the Super `DropdownMenu`
 * (`trigger="hover"`). Kept for existing call sites; new code should prefer
 * `<DropdownMenu trigger="hover" />`.
 */
export function FloatingMenu({
  items,
  trigger,
  placement = "bottom-start",
  openOnHover = false,
  className,
  style,
}: FloatingMenuProps) {
  const entries: MenuEntry[] = items.map((item) => ({
    type: "item" as const,
    value: item.id,
    label: item.label,
    icon: item.icon,
    disabled: item.disabled,
    danger: item.intent === "danger",
    onClick: item.onClick,
  }));

  return (
    <DropdownMenu trigger="hover" items={entries} placement={placement} openOnHover={openOnHover}>
      <span className={className} style={style}>
        {trigger}
      </span>
    </DropdownMenu>
  );
}
