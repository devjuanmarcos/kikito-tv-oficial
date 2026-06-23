"use client";

import { Button } from "@/components/ui/cn/button";
import type { ButtonIntent, ButtonSize } from "@/components/ui/cn/button";

import type { ConfettiButtonProps } from "./confetti-button.types";

/**
 * ConfettiButton — backward-compat wrapper.
 * The canvas confetti burst now lives in the Super `Button` (effect="confetti").
 * This thin wrapper preserves the original API and visual.
 */
export function ConfettiButton({
  children,
  onClick,
  particleCount = 60,
  spread = 120,
  intent = "primary",
  size = "md",
  disabled = false,
  className,
  style,
}: ConfettiButtonProps) {
  return (
    <Button
      effect="confetti"
      intent={intent as ButtonIntent}
      variant="solid"
      size={size as ButtonSize}
      particleCount={particleCount}
      spread={spread}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </Button>
  );
}
