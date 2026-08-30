import type React from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

/* ── Absorbed variant types ─────────────────────────────────────────────── */
export type AlertDialogIntent = "danger" | "warning" | "primary";
export type DrawerSide = "right" | "left" | "bottom" | "top";
export type DrawerSize = "sm" | "md" | "lg" | "xl";

export type ModalVariant = "modal" | "alert" | "drawer" | "panel";
/** Entry direction for `variant="modal"` (default). `"scale"` is the original scale+fade-up entry. */
export type ModalEntryDirection = "scale" | "top" | "bottom" | "left" | "right";

export interface ModalProps {
  // variant="panel" e o unico que tem estado uncontrolled proprio (ModalPanel usa
  // useState(defaultOpen) + `controlled = open !== undefined`) -- open opcional deixa
  // SidePanel (wrapper fino sobre esta variante) omitir a prop de verdade em vez de
  // forcar um boolean concreto que quebrava o toggle nao-controlado. Os outros variants
  // (dialog/alert/drawer) tratam `open` ausente igual a false (`if (!open) return`),
  // sem mudanca de comportamento pra quem ja passa um boolean explicito.
  open?: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  hideClose?: boolean;
  className?: string;
  /** Selects render family. Default `modal`. */
  variant?: ModalVariant;
  /** variant="modal": which edge the panel enters from. @default "scale" */
  entryDirection?: ModalEntryDirection;

  /* ── alert variant extras ── */
  intent?: AlertDialogIntent;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  style?: React.CSSProperties;

  /* ── drawer variant extras ── */
  side?: DrawerSide;
  /** Drawer-specific size scale (sm|md|lg|xl). Falls back to `size` semantics. */
  drawerSize?: DrawerSize;
  footer?: React.ReactNode;
  footerAlign?: "left" | "right" | "center" | "between";

  /* ── panel variant extras ── */
  panel?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  panelSide?: "left" | "right";
  panelWidth?: number;
  collapsedWidth?: number;
}

export interface ModalBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "center" | "between";
  className?: string;
}
