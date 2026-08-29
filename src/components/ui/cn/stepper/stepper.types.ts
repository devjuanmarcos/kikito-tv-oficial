import type React from "react";

export type StepperOrientation = "horizontal" | "vertical";
export type StepStatus = "upcoming" | "active" | "completed" | "error";

export interface StepDef {
  label: string;
  description?: string;
  content?: React.ReactNode;
  optional?: boolean;
  status?: StepStatus;
}

export interface StepperProps {
  steps: StepDef[];
  activeStep?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  orientation?: StepperOrientation;
  clickable?: boolean;
  className?: string;
  children?: React.ReactNode;
}
