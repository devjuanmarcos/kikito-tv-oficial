import type React from "react";

export interface WordCounterProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  maxWords?: number;
  maxChars?: number;
  rows?: number;
  placeholder?: string;
  label?: string;
  showSentences?: boolean;
  showReadTime?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
