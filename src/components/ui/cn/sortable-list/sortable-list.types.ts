import type React from "react";

export interface SortableItem {
  id: string;
  content: React.ReactNode;
}

export interface SortableListProps {
  items: SortableItem[];
  onChange?: (items: SortableItem[]) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
