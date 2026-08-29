import type { AreaChartProps } from "@/components/ui/cn/area-chart";
import type { BarChartProps } from "@/components/ui/cn/bar-chart";
import type { DonutChartProps } from "@/components/ui/cn/donut-chart";
import type { FunnelChartProps } from "@/components/ui/cn/funnel-chart";
import type { LineChartProps } from "@/components/ui/cn/line-chart";
import type { PieChartProps } from "@/components/ui/cn/pie-chart";
import type { RadarChartProps } from "@/components/ui/cn/radar-chart";
import type { SparklineProps, SparklineType } from "@/components/ui/cn/sparkline";

export type ChartType = "line" | "area" | "bar" | "donut" | "pie" | "radar" | "funnel" | "sparkline";

/* Sparkline already owns a `type` prop, so its variant is exposed as `sparklineType`. */
type SparklineMember = { type: "sparkline"; sparklineType?: SparklineType } & Omit<SparklineProps, "type">;

export type ChartProps =
  | ({ type?: "line" } & LineChartProps)
  | ({ type: "area" } & AreaChartProps)
  | ({ type: "bar" } & BarChartProps)
  | ({ type: "donut" } & DonutChartProps)
  | ({ type: "pie" } & PieChartProps)
  | ({ type: "radar" } & RadarChartProps)
  | ({ type: "funnel" } & FunnelChartProps)
  | SparklineMember;
