"use client";
/**
 * MetricCard — backward-compat wrapper.
 * Absorbed by the Stat Super component (`<Stat mode="metric" />`). Kept so
 * existing imports of `MetricCard` keep working; new code should use Stat directly.
 */
import { Stat } from "@/components/ui/cn/stat";

import type { MetricCardProps } from "./metric-card.types";

export function MetricCard(props: MetricCardProps) {
  return <Stat mode="metric" {...props} />;
}
