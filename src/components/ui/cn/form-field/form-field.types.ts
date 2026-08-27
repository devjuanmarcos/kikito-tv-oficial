import type React from "react";

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  style?: React.CSSProperties;
}
