"use client";
import { Timeline } from "../timeline/Timeline";

import type { ScrollTimelineProps } from "./scroll-timeline.types";

/**
 * ScrollTimeline — backward-compat wrapper over the Super `Timeline`.
 * Forwards to `<Timeline variant="scroll" />`.
 */
export function ScrollTimeline(props: ScrollTimelineProps) {
  return <Timeline variant="scroll" {...props} />;
}
