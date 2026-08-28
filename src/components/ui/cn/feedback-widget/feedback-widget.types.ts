import type React from "react";

export type FeedbackType = "nps" | "stars" | "emoji";

export interface FeedbackWidgetProps {
  type?: FeedbackType;
  title?: string;
  placeholder?: string;
  onSubmit?: (score: number, comment: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
