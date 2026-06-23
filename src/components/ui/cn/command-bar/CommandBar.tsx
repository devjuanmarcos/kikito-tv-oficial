"use client";

import { Command } from "@/components/ui/cn/command";

import type { CommandBarProps } from "./command-bar.types";

/**
 * CommandBar — backward-compat wrapper over the Super `Command` component.
 * Renders the inline command bar via `variant="bar"`.
 */
export function CommandBar(props: CommandBarProps) {
  return <Command variant="bar" {...props} />;
}
