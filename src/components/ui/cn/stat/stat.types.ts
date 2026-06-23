import type React from "react";

export type StatMode = "single" | "metric" | "grid";

export type StatTrend = "up" | "down" | "neutral";
export type StatIntent = "default" | "primary" | "success" | "warning" | "danger";

/* ── metric mode (absorbed MetricCard) ──────────────────────────────────── */
export type MetricIntent = "primary" | "success" | "warning" | "danger" | "info" | "neutral";
export type MetricTrend = "up" | "down" | "flat";

/* ── grid mode (absorbed StatsCard) ─────────────────────────────────────── */
export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: StatTrend;
  icon?: React.ReactNode;
}

/* ── single mode (default) ──────────────────────────────────────────────── */
export interface StatSingleProps {
  mode?: "single";
  label: string;
  value: string | number;
  description?: string;
  trend?: StatTrend;
  trendValue?: string;
  icon?: React.ReactNode;
  intent?: StatIntent;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/* ── metric mode ────────────────────────────────────────────────────────── */
export interface StatMetricProps {
  mode: "metric";
  label: string;
  value: string | number;
  unit?: string;
  trend?: MetricTrend;
  trendValue?: string;
  trendLabel?: string;
  sparkline?: number[];
  intent?: MetricIntent;
  loading?: boolean;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

/* ── grid mode ──────────────────────────────────────────────────────────── */
export interface StatGridProps {
  mode: "grid";
  stats: StatItem[];
  cols?: 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
}

export type StatProps = StatSingleProps | StatMetricProps | StatGridProps;
