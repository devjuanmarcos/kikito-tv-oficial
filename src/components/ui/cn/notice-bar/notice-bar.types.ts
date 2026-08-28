import type React from "react";

export type NoticeBarIntent = "info" | "success" | "warning" | "danger" | "neutral";

export interface NoticeBarAction {
  label: string;
  onClick: () => void;
}

export interface NoticeBarProps {
  children: React.ReactNode;
  intent?: NoticeBarIntent;
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: NoticeBarAction;
  className?: string;
  style?: React.CSSProperties;
}
