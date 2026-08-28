import type React from "react";

export type QuoteBlockVariant = "default" | "bordered" | "filled" | "minimal";

export interface QuoteBlockProps {
  children: React.ReactNode;
  variant?: QuoteBlockVariant;
  author?: string;
  role?: string;
  avatar?: string;
  avatarFallback?: string;
  className?: string;
  style?: React.CSSProperties;
}
