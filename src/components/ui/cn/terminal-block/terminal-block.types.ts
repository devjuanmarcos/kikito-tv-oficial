import type React from "react";

export type TerminalLineType = "command" | "output" | "error" | "info" | "success";

export interface TerminalLine {
  text: string;
  type?: TerminalLineType;
  prompt?: string;
}

export interface TerminalBlockProps {
  lines: TerminalLine[];
  title?: string;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
