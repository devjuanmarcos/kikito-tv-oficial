"use client";
import React from "react";

import { Modal } from "@/components/ui/cn/modal";

import type { AlertDialogProps } from "./alert-dialog.types";

/**
 * AlertDialog — backward-compat wrapper over the Super `Modal` (variant="alert").
 * Render/behavior absorbed verbatim into Modal; this maps the legacy
 * `onOpenChange` API onto Modal's `onClose`.
 */
export function AlertDialog({ open, onOpenChange, ...rest }: AlertDialogProps) {
  return <Modal variant="alert" open={open} onClose={() => onOpenChange(false)} {...rest} />;
}
