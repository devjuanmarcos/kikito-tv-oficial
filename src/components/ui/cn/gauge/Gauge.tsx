import { Progress } from "../progress/Progress";

import type { GaugeProps } from "./gauge.types";

/**
 * Gauge — backward-compat wrapper over the Super `Progress` component.
 * Delegates to `<Progress shape="gauge" />`. Prefer importing `Progress` directly.
 */
export function Gauge(props: GaugeProps) {
  return <Progress shape="gauge" {...props} />;
}
