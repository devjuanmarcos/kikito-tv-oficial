import type { StatGridProps, StatItem, StatTrend } from "@/components/ui/cn/stat/stat.types";

export type { StatItem, StatTrend };
export type StatsCardProps = Omit<StatGridProps, "mode">;
