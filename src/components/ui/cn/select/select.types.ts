import type React from "react";

export type SelectSize = "sm" | "md" | "lg";
export type SelectVariant = "outline" | "filled" | "ghost";
export type SelectState = "default" | "error" | "success" | "warning";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}
export type SelectItem = SelectOption | SelectGroup;

/* ── absorbed family option types ──────────────────────────────────────── */
export type MultiSelectSize = "sm" | "md" | "lg";
export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface RichSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
  group?: string;
}
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Icon/avatar/flag slot rendered before the label — paridade com single/rich. */
  icon?: React.ReactNode;
  /** Agrupa opções sob um cabeçalho — paridade com single/rich (SelectGroup/RichSelectOption.group). */
  group?: string;
}

/* ── per-mode prop shapes ──────────────────────────────────────────────── */
export interface SelectSingleProps {
  /** Single-value dropdown (default). */
  mode?: "single";
  options?: SelectItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option?: SelectOption) => void;
  placeholder?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  state?: SelectState;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  warningText?: string;
  iconLeft?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MultiSelectProps {
  mode: "multi";
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  size?: MultiSelectSize;
  disabled?: boolean;
  maxSelected?: number;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface RichSelectProps {
  mode: "rich";
  options: RichSelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export interface ComboboxProps {
  mode: "combobox";
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[], options: ComboboxOption[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  state?: "default" | "error" | "success";
  disabled?: boolean;
  maxSelected?: number;
  className?: string;
}

export type SelectProps = SelectSingleProps | MultiSelectProps | RichSelectProps | ComboboxProps;
