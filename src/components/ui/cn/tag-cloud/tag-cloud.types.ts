import type React from "react";

export type TagCloudIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";

export interface TagCloudItem {
  label: string;
  weight: number;
  intent?: TagCloudIntent;
  href?: string;
}

export interface TagCloudProps {
  items: TagCloudItem[];
  minSize?: number;
  maxSize?: number;
  randomRotate?: boolean;
  onClick?: (item: TagCloudItem) => void;
  className?: string;
  style?: React.CSSProperties;
}
