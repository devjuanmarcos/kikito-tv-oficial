export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerIntent = "primary" | "secondary" | "neutral" | "current";
export type SpinnerVariant = "ring" | "orbital";

export interface SpinnerProps {
  size?: SpinnerSize;
  intent?: SpinnerIntent;
  /** Visual style. `orbital` is a pulsing core with a satellite dot orbiting it. @default 'ring' */
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
