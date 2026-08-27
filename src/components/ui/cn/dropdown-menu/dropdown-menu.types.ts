import type React from "react";

export type MenuPlacement = "bottom-start" | "bottom" | "bottom-end" | "top-start" | "top" | "top-end";

export interface MenuItem {
  type: "item";
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface MenuSeparator {
  type: "separator";
}

export interface MenuGroup {
  type: "group";
  label: string;
  items: MenuItem[];
}

export type MenuEntry = MenuItem | MenuSeparator | MenuGroup;

/** Discriminator selecting how the menu opens. */
export type DropdownMenuTrigger = "click" | "contextmenu" | "hover";

/** Placement set accepted by the hover trigger (superset incl. left/right). */
export type HoverMenuPlacement = MenuPlacement | "left" | "right";

export interface DropdownMenuProps {
  items: MenuEntry[];
  placement?: MenuPlacement | HoverMenuPlacement;
  children: React.ReactElement;
  /**
   * How the menu is opened (default `"click"`).
   * - `"click"` — click the trigger (classic dropdown).
   * - `"contextmenu"` — right-click anywhere on the trigger (absorbs ContextMenu).
   * - `"hover"` — hover/click the trigger (absorbs FloatingMenu).
   */
  trigger?: DropdownMenuTrigger;
  /**
   * Only meaningful when `trigger="hover"`. When `true` the menu opens on
   * mouse-enter; when `false` (default) it toggles on click. Mirrors the
   * former FloatingMenu `openOnHover`.
   */
  openOnHover?: boolean;
}
