import type React from "react";

export type AccordionGroupType = "single" | "multi";
export type AccordionGroupVariant = "default" | "card" | "flush";

export interface AccordionGroupItem {
  id: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionGroupProps {
  items: AccordionGroupItem[];
  type?: AccordionGroupType;
  variant?: AccordionGroupVariant;
  defaultOpen?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}
