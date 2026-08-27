"use client";

import { Button } from "@/components/ui/cn/button";

import type { ConfirmButtonProps } from "./confirm-button.types";

/**
 * ConfirmButton — backward-compat wrapper.
 * The confirmation gesture (doubleclick/hold) now lives in the Super `Button`
 * (`confirm="doubleclick" | "hold"`). This thin wrapper preserves the original API.
 */
export function ConfirmButton({
  children,
  onConfirm,
  confirmLabel = "Click again to confirm",
  mode = "doubleclick",
  holdDuration = 800,
  intent = "danger",
  variant = "solid",
  resetDelay = 2000,
  className,
  style,
  ...rest
}: ConfirmButtonProps) {
  return (
    <Button
      {...rest}
      confirm={mode}
      confirmLabel={confirmLabel}
      holdDuration={holdDuration}
      resetDelay={resetDelay}
      intent={intent}
      variant={variant}
      onClick={() => onConfirm()}
      className={className}
      style={style}
    >
      {children}
    </Button>
  );
}
