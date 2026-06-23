import type React from "react";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
  keywords?: string[];
  disabled?: boolean;
}

export interface CommandGroup {
  heading?: string;
  items: CommandItem[];
}

export type CommandVariant = "palette" | "bar" | "spotlight";

/* ── Palette (default) ───────────────────────────────────────────────────── */
export interface CommandPaletteProps {
  groups: CommandGroup[];
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  keybinding?: string;
  emptyMessage?: string;
}

/* ── Bar (absorbed from command-bar) ─────────────────────────────────────── */
export interface CommandBarAction {
  id: string;
  label: string;
  shortcut?: string[];
  icon?: React.ReactNode;
  onSelect?: () => void;
  group?: string;
}

export interface CommandBarProps {
  actions: CommandBarAction[];
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Spotlight (absorbed from spotlight-search) ──────────────────────────── */
export interface SpotlightAction {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  shortcut?: string[];
  onSelect: () => void;
}

export interface CommandSpotlightProps {
  actions: SpotlightAction[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  maxResults?: number;
  className?: string;
}

/* ── Super discriminated union ───────────────────────────────────────────── */
export type CommandProps =
  | ({ variant?: "palette" } & CommandPaletteProps)
  | ({ variant: "bar" } & CommandBarProps)
  | ({ variant: "spotlight" } & CommandSpotlightProps);
