"use client";
/**
 * ShortcutKey — backward-compat wrapper.
 * Absorbed by Kbd's KbdSequence (`<KbdSequence symbols separator="+" />`), which
 * maps special key names to symbols. New code should use KbdSequence directly.
 */
import { KbdSequence } from "@/components/ui/cn/kbd";

import type { ShortcutKeyProps } from "./shortcut-key.types";

export function ShortcutKey({ keys, size = "md", variant = "default", className, style }: ShortcutKeyProps) {
  return (
    <span className={className} style={style}>
      <KbdSequence keys={keys} symbols separator="+" size={size} variant={variant === "filled" ? "solid" : "default"} />
    </span>
  );
}
