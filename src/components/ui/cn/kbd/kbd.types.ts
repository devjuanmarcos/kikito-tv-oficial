import type React from "react";

export type KbdSize = "sm" | "md" | "lg";
export type KbdVariant = "default" | "ghost" | "solid";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: KbdSize;
  variant?: KbdVariant;
}

export interface KbdSequenceProps {
  keys: string[];
  separator?: string;
  size?: KbdSize;
  variant?: KbdVariant;
  /** Map special key names (cmd, shift, enter…) to symbols and uppercase the rest. */
  symbols?: boolean;
}
