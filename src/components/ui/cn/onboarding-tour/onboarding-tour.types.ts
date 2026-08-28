export type TourPlacement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: TourPlacement;
}

export interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}
