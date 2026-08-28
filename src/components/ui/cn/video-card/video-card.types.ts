import type React from "react";

export interface VideoCardProps {
  /** URL do vídeo — usado pro preview em hover (mudo, silencioso). Requer `poster` pra fallback estático. */
  src?: string;
  poster?: string;
  title?: string;
  description?: string;
  duration?: string;
  category?: string;
  views?: string | number;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}
