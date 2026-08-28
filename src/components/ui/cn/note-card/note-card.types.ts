import type React from "react";

export type NoteCardColor = "yellow" | "blue" | "green" | "pink" | "purple" | "orange";

export interface NoteCardProps {
  children: React.ReactNode;
  color?: NoteCardColor;
  rotate?: number;
  author?: string;
  date?: string;
  className?: string;
  style?: React.CSSProperties;
}
