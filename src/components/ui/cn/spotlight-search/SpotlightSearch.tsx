"use client";

import { Command } from "@/components/ui/cn/command";

import type { SpotlightSearchProps } from "./spotlight-search.types";

/**
 * SpotlightSearch — backward-compat wrapper over the Super `Command` component.
 * Renders the fullscreen spotlight search via `variant="spotlight"`.
 */
export function SpotlightSearch(props: SpotlightSearchProps) {
  return <Command variant="spotlight" {...props} />;
}
