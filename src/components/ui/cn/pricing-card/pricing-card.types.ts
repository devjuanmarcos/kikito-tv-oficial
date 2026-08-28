import type React from "react";

export interface PricingFeature {
  label: string;
  included: boolean;
  note?: string;
}

export interface PricingCardProps {
  name: string;
  price: string;
  features: PricingFeature[];
  period?: string;
  description?: string;
  cta?: string;
  onSelect?: () => void;
  highlighted?: boolean;
  badge?: string;
  className?: string;
  style?: React.CSSProperties;
}
