import type React from "react";

export type SearchInputSize = "sm" | "md" | "lg";

export interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  size?: SearchInputSize;
  shortcut?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
