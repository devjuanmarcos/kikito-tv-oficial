"use client";
import React from "react";

import { Modal } from "@/components/ui/cn/modal";

import type { DrawerProps } from "./drawer.types";

/**
 * Drawer — backward-compat wrapper over the Super `Modal` (variant="drawer").
 * Render/behavior absorbed verbatim into Modal; the legacy `size` prop maps to
 * Modal's `drawerSize` (Modal.size is the centered-dialog scale).
 */
export function Drawer({ size = "md", ...rest }: DrawerProps) {
  return <Modal variant="drawer" drawerSize={size} {...rest} />;
}
