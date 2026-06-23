import { Progress } from "../progress/Progress";

import type { ProgressRingProps } from "./progress-ring.types";

/**
 * ProgressRing — backward-compat wrapper over the Super `Progress` component.
 * Delegates to `<Progress shape="ring" />`. Prefer importing `Progress` directly.
 */
export function ProgressRing(props: ProgressRingProps) {
  return <Progress shape="ring" {...props} />;
}
