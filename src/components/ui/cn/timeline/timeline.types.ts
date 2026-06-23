import type React from "react";

/* ── default family (classic vertical timeline) ──────────────────────────── */
export type TimelineStatus = "pending" | "active" | "complete" | "error" | "warning";
export type TimelineVariant = "default" | "compact" | "reverse";

export interface TimelineItem {
  id?: string;
  title: string;
  description?: React.ReactNode;
  timestamp?: string;
  status?: TimelineStatus;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface TimelineDefaultProps {
  /** Family selector. Omit/`'default'` for the classic vertical timeline. */
  variant?: TimelineVariant;
  items: TimelineItem[];
  lastLine?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* ── scroll family (absorbed from ScrollTimeline) ────────────────────────── */
export interface ScrollTimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  intent?: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "neutral";
}

export interface ScrollTimelineProps {
  events: ScrollTimelineEvent[];
  orientation?: "left" | "right" | "alternating";
  lineColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineScrollProps extends ScrollTimelineProps {
  variant: "scroll";
}

/* ── progress family (absorbed from TimelineProgress) ────────────────────── */
export type TimelineStepStatus = "completed" | "current" | "upcoming" | "error";
export type TimelineOrientation = "horizontal" | "vertical";

export interface TimelineProgressStep {
  id: string;
  label: string;
  description?: string;
  status: TimelineStepStatus;
  icon?: React.ReactNode;
}

export interface TimelineProgressProps {
  steps: TimelineProgressStep[];
  orientation?: TimelineOrientation;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineProgressVariantProps extends TimelineProgressProps {
  variant: "progress";
}

/* ── activity family (absorbed from ActivityFeed) ────────────────────────── */
export type ActivityFeedIntent = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

export interface ActivityFeedItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  time: string;
  icon?: React.ReactNode;
  intent?: ActivityFeedIntent;
  avatar?: string;
  avatarFallback?: string;
}

export interface ActivityFeedProps {
  items: ActivityFeedItem[];
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineActivityProps extends ActivityFeedProps {
  variant: "activity";
}

/* ── Super union ─────────────────────────────────────────────────────────── */
export type TimelineProps =
  | TimelineDefaultProps
  | TimelineScrollProps
  | TimelineProgressVariantProps
  | TimelineActivityProps;
