import type React from "react";

export type MediaPlayerType = "audio" | "video";

export interface MediaPlayerProps {
  title?: string;
  artist?: string;
  cover?: string;
  src?: string;
  type?: MediaPlayerType;
  className?: string;
  style?: React.CSSProperties;
}
