import type React from "react";

export interface TextEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Accessible name for the editable region (screen readers). Defaults to `placeholder`. */
  ariaLabel?: string;
  minHeight?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
