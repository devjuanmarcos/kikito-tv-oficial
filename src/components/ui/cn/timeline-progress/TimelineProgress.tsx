"use client";
import { Timeline } from "../timeline/Timeline";

import type { TimelineProgressProps } from "./timeline-progress.types";

/**
 * TimelineProgress — backward-compat wrapper over the Super `Timeline`.
 * Forwards to `<Timeline variant="progress" />`.
 */
export function TimelineProgress(props: TimelineProgressProps) {
  return <Timeline variant="progress" {...props} />;
}
