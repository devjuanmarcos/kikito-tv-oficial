import type React from "react";

export interface InlineEditProps {
  value: string;
  onConfirm: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
