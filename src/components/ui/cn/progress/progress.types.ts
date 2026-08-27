import type React from "react";

export type ProgressIntent = "primary" | "info" | "success" | "warning" | "danger";
export type ProgressSize = "xs" | "sm" | "md" | "lg";

/* ── Ring (circular) types ───────────────────────────────────────────────── */
export type ProgressRingIntent = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

/* ── Gauge (arc) types ───────────────────────────────────────────────────── */
export type GaugeIntent = "default" | "primary" | "success" | "warning" | "danger";
export type GaugeSize = "sm" | "md" | "lg";

/* ── Skill-list types ────────────────────────────────────────────────────── */
export type SkillBarIntent = "primary" | "success" | "warning" | "danger" | "secondary";

export interface SkillItem {
  label: string;
  value: number;
  max?: number;
  intent?: SkillBarIntent;
  sublabel?: string;
}

/* ── Props (discriminated by shape / mode) ───────────────────────────────── */
export interface ProgressBarProps {
  /** Render shape. Default 'bar' (linear). */
  shape?: "bar";
  mode?: "single";
  value?: number;
  max?: number;
  intent?: ProgressIntent;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressRingShapeProps {
  shape: "ring";
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  intent?: ProgressRingIntent;
  label?: React.ReactNode;
  showValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressGaugeShapeProps {
  shape: "gauge";
  value: number;
  max?: number;
  size?: GaugeSize;
  intent?: GaugeIntent;
  label?: string;
  showValue?: boolean;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface ProgressSkillListProps {
  mode: "skill-list";
  shape?: "bar";
  skills: SkillItem[];
  animate?: boolean;
  showValues?: boolean;
  height?: number;
  intent?: SkillBarIntent;
  className?: string;
  style?: React.CSSProperties;
}

export type ProgressProps =
  | ProgressBarProps
  | ProgressRingShapeProps
  | ProgressGaugeShapeProps
  | ProgressSkillListProps;
