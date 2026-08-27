import type React from "react";

export type TagInputSize = "sm" | "md" | "lg";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  allowDuplicates?: boolean;
  delimiter?: string | RegExp;
  size?: TagInputSize;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
