import type { StatMetricProps, MetricIntent, MetricTrend } from "@/components/ui/cn/stat/stat.types";

export type { MetricIntent, MetricTrend };
export type MetricCardProps = Omit<StatMetricProps, "mode">;
