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
  // NAO resolver `open ?? defaultOpen` aqui: isso sempre produzia um boolean concreto,
  // o que fazia o ModalPanel (que decide `controlled = controlledOpen !== undefined`)
  // achar que SidePanel É controlado mesmo quando ninguem passa `open` de fora —
  // o botao de toggle interno clicava e nada acontecia (onOpenChange disparava, mas
  // o valor de `open` recomputado no proximo render era sempre o mesmo). ModalPanel
  // JA tem seu proprio estado uncontrolled (useState(defaultOpen)); repassar `open`
  // e `defaultOpen` intocados deixa ele decidir sozinho. Achado real na varredura de
  // showcase, 2026-08-30 — corrige uma regressao do proprio commit d0e82c5.
  return <Modal variant="panel" panelSide={side} onClose={() => {}} {...rest} />;
}
