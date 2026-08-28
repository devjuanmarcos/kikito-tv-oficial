import type React from "react";

export type PasswordInputSize = "sm" | "md" | "lg";

export interface PasswordInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  size?: PasswordInputSize;
  disabled?: boolean;
  invalid?: boolean;
  showStrength?: boolean;
  hint?: string;
  errorMessage?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}
