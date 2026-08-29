import type React from "react";

export interface MultiAccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  intent?: "primary" | "secondary" | "tertiary" | "quaternary" | "info" | "success" | "warning" | "danger" | "neutral";
}

export interface MultiAccordionProps {
  items: MultiAccordionItem[];
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  variant?: "default" | "bordered" | "flush";
  className?: string;
  style?: React.CSSProperties;
}
