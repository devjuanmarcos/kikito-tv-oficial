import type React from "react";

export type FeatureListVariant = "check" | "numbered" | "icon";
export type FeatureListIntent = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

export interface FeatureItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  available?: boolean;
}

export interface FeatureListProps {
  items: FeatureItem[];
  variant?: FeatureListVariant;
  intent?: FeatureListIntent;
  className?: string;
  style?: React.CSSProperties;
}
