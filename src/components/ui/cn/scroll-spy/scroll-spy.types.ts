import type React from "react";

export interface ScrollSpyItem {
  id: string;
  label: string;
  depth?: 1 | 2;
}

export interface ScrollSpyProps {
  items: ScrollSpyItem[];
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
}
