"use client";
import type React from "react";

import { DropdownMenu, type MenuEntry } from "@/components/ui/cn/dropdown-menu/DropdownMenu";

export type FloatingMenuPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

export interface FloatingMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  intent?: "danger" | "default";
  disabled?: boolean;
  onClick?: () => void;
}

export interface FloatingMenuProps {
  items: FloatingMenuItem[];
  trigger: React.ReactNode;
  placement?: FloatingMenuPlacement;
  openOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

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
