"use client";

import { Progress } from "../progress/Progress";

import type { SkillBarProps } from "./skill-bar.types";

/**
 * SkillBar — backward-compat wrapper over the Super `Progress` component.
 * Delegates to `<Progress mode="skill-list" />`. Prefer importing `Progress` directly.
 */
export function SkillBar(props: SkillBarProps) {
  return <Progress mode="skill-list" {...props} />;
}
