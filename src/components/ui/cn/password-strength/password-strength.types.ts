import type React from "react";

export interface PasswordStrengthProps {
  value: string;
  showRules?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
