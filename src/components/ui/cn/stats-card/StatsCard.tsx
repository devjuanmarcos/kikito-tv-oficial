"use client";
/**
 * StatsCard — backward-compat wrapper.
 * Absorbed by the Stat Super component (`<Stat mode="grid" />`). Kept so existing
 * imports of `StatsCard` keep working; new code should use Stat directly.
 */
import { Stat } from "@/components/ui/cn/stat";
import type { StatGridProps } from "@/components/ui/cn/stat/stat.types";

export type { StatItem, StatTrend } from "@/components/ui/cn/stat/stat.types";
export type StatsCardProps = Omit<StatGridProps, "mode">;

export function StatsCard(props: StatsCardProps) {
  return <Stat mode="grid" {...props} />;
}
