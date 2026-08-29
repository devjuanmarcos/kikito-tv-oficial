import type React from "react";

export type NavigationMenuOrientation = "horizontal" | "vertical";

export interface NavigationMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationMenuItem[];
}

export interface NavigationMenuProps {
  items: NavigationMenuItem[];
  activeHref?: string;
  orientation?: NavigationMenuOrientation;
  onNavigate?: (href: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
