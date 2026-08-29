import type React from "react";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}
