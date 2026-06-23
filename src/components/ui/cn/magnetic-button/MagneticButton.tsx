"use client";

import { Button } from "@/components/ui/cn/button";

import type { MagneticButtonProps } from "./magnetic-button.types";

/**
 * MagneticButton — backward-compat wrapper.
 * The magnetic physics now live in the Super `Button` (effect="magnetic").
 * This thin wrapper preserves the original API and visual.
 */
export function MagneticButton({
  children,
  strength = 0.4,
  radius = 80,
  onClick,
  disabled = false,
  className,
  style,
}: MagneticButtonProps) {
  return (
    <Button
      effect="magnetic"
      intent="primary"
      variant="solid"
      magneticStrength={strength}
      magneticRadius={radius}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </Button>
  );
}
