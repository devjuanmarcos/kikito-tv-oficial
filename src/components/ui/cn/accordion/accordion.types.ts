import type React from "react";

export type AccordionVariant = "default" | "separated" | "ghost";

export interface AccordionItemDef {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemDef[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  variant?: AccordionVariant;
  className?: string;
}
