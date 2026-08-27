import type React from "react";

export type ProgressStepsOrientation = "horizontal" | "vertical";
export type ProgressStepsSize = "sm" | "md" | "lg";
export type ProgressStepStatus = "complete" | "current" | "upcoming";

export interface ProgressStep {
  label: string;
  description?: string;
  status?: ProgressStepStatus;
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  current: number;
  orientation?: ProgressStepsOrientation;
  size?: ProgressStepsSize;
  className?: string;
  style?: React.CSSProperties;
}
