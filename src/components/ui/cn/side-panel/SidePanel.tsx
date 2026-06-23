"use client";

import React from "react";

import { Modal } from "@/components/ui/cn/modal";

import type { SidePanelProps } from "./side-panel.types";

/**
 * SidePanel — backward-compat wrapper over the Super `Modal` (variant="panel").
 * Render/behavior absorbed verbatim into Modal; legacy `side` maps to
 * Modal's `panelSide`. SidePanel has no dismiss action, so `onClose` is a no-op.
 */
export function SidePanel({ side = "left", ...rest }: SidePanelProps) {
  return <Modal variant="panel" panelSide={side} onClose={() => {}} {...rest} />;
}
