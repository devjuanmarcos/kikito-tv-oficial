import type React from "react";

export type DotStepperVariant = "dot" | "dash" | "progress";

export interface DotStepperProps {
  steps: number;
  current: number;
  onChange?: (index: number) => void;
  variant?: DotStepperVariant;
  className?: string;
  style?: React.CSSProperties;
}
