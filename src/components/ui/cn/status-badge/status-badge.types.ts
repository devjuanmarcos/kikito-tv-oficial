import type React from "react";

export type StatusBadgeStatus = "online" | "offline" | "busy" | "away" | "idle";
export type StatusBadgeSize = "sm" | "md" | "lg";

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  size?: StatusBadgeSize;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
