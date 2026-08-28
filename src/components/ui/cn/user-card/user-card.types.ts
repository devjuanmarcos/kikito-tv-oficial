import type React from "react";

export interface UserStat {
  label: string;
  value: string | number;
}

export interface UserCardProps {
  name: string;
  username?: string;
  bio?: string;
  avatar?: string;
  avatarFallback?: string;
  stats?: UserStat[];
  badge?: string;
  followed?: boolean;
  onFollow?: (followed: boolean) => void;
  coverColor?: string;
  className?: string;
  style?: React.CSSProperties;
}
