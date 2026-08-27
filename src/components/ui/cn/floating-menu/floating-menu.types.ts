import type React from "react";

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
