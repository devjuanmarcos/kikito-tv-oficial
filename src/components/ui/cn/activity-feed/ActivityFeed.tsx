"use client";
import { Timeline } from "../timeline/Timeline";

import type { ActivityFeedProps } from "./activity-feed.types";

/**
 * ActivityFeed — backward-compat wrapper over the Super `Timeline`.
 * Forwards to `<Timeline variant="activity" />`.
 */
export function ActivityFeed(props: ActivityFeedProps) {
  return <Timeline variant="activity" {...props} />;
}
