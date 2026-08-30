import type React from "react";

export type ButtonVariant = "solid" | "outline" | "ghost" | "soft" | "dashed" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonIntent = "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "neutral";
export type ButtonStatus = "idle" | "loading" | "success" | "error";
export type ButtonRounded = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ButtonLoadingPosition = "left" | "replace";

/** Visual/physics effects absorbed from sibling components. */
export type ButtonEffect = "none" | "magnetic" | "confetti" | "lift" | "reveal" | "radial-fill" | "shine";
/** Confirmation interaction absorbed from ConfirmButton. */
export type ButtonConfirm = "doubleclick" | "hold";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  intent?: ButtonIntent;
  /** Simple boolean loading (uncontrolled). Prefer `status` for async feedback. */
  loading?: boolean;
  /** Controlled async state — drives spinner → checkmark/X transitions. */
  status?: ButtonStatus;
  successText?: string;
  errorText?: string;
  loadingText?: string;
  loadingPosition?: ButtonLoadingPosition;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Square icon-only button — hides children, forces equal width/height. */
  iconOnly?: boolean;
  fullWidth?: boolean;
  /** Override border-radius independently of size. */
  rounded?: ButtonRounded;
  /** Polymorphic root — pass 'a' to render as a link button. */
  as?: React.ElementType;

  /* ── Absorbed effects (Super dispatch) ── */
  /**
   * Visual/physics effect. 'magnetic' pulls toward cursor; 'confetti' bursts on click;
   * 'lift' rises on hover; 'reveal' slides `iconRight` in on hover; 'radial-fill' expands
   * a glow from the cursor position on hover; 'shine' sweeps a light band across on hover.
   */
  effect?: ButtonEffect;
  /** Strength of the magnetic pull (effect="magnetic"). */
  magneticStrength?: number;
  /** Activation radius in px for the magnetic pull (effect="magnetic"). */
  magneticRadius?: number;
  /** Number of confetti particles (effect="confetti"). */
  particleCount?: number;
  /** Confetti spread (effect="confetti"). */
  spread?: number;

  /* ── Absorbed confirmation (Super dispatch) ── */
  /** Require a confirmation gesture before firing onClick: double-click or press-and-hold. */
  confirm?: ButtonConfirm;
  /** Label shown while awaiting the second click (confirm="doubleclick"). */
  confirmLabel?: React.ReactNode;
  /** Hold duration in ms (confirm="hold"). */
  holdDuration?: number;
  /** Delay before resetting the confirming state (confirm="doubleclick"). */
  resetDelay?: number;
}
