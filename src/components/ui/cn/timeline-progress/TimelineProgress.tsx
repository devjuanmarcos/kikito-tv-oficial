"use client";
import { Timeline } from "../timeline/Timeline";
import type {
  TimelineProgressProps,
  TimelineProgressStep,
  TimelineStepStatus,
  TimelineOrientation,
} from "../timeline/timeline.types";

export type { TimelineProgressProps, TimelineProgressStep, TimelineStepStatus, TimelineOrientation };

/**
 * TimelineProgress — backward-compat wrapper over the Super `Timeline`.
 * Forwards to `<Timeline variant="progress" />`.
 */
export function TimelineProgress(props: TimelineProgressProps) {
  return <Timeline variant="progress" {...props} />;
}
