import type React from "react";

export type NotificationIntent = "info" | "success" | "warning" | "danger" | "neutral";

export interface Notification {
  id: string;
  title: string;
  body?: string;
  time?: string;
  read?: boolean;
  intent?: NotificationIntent;
  avatar?: string;
}

export interface NotificationBellProps {
  notifications?: Notification[];
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  onDismiss?: (id: string) => void;
  maxVisible?: number;
  className?: string;
  style?: React.CSSProperties;
}
