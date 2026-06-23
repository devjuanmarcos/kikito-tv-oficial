"use client";
/**
 * Chart — Super component.
 * Single catalog entry that dispatches by `type` to the dedicated chart
 * renderers (line/area/bar/donut/radar/funnel/sparkline). The SVG renderers
 * are unchanged — Chart only routes props, so each chart keeps its exact look.
 * The individual components remain importable (backward-compat).
 */
import { AreaChart } from "@/components/ui/cn/area-chart";
import type { AreaChartProps } from "@/components/ui/cn/area-chart";
import { BarChart } from "@/components/ui/cn/bar-chart";
import type { BarChartProps } from "@/components/ui/cn/bar-chart";
import { DonutChart } from "@/components/ui/cn/donut-chart";
import type { DonutChartProps } from "@/components/ui/cn/donut-chart";
import { FunnelChart } from "@/components/ui/cn/funnel-chart";
import type { FunnelChartProps } from "@/components/ui/cn/funnel-chart";
import { LineChart } from "@/components/ui/cn/line-chart";
import type { LineChartProps } from "@/components/ui/cn/line-chart";
import { RadarChart } from "@/components/ui/cn/radar-chart";
import type { RadarChartProps } from "@/components/ui/cn/radar-chart";
import { Sparkline } from "@/components/ui/cn/sparkline";
import type { SparklineProps, SparklineType } from "@/components/ui/cn/sparkline";

export type ChartType = "line" | "area" | "bar" | "donut" | "radar" | "funnel" | "sparkline";

/* Sparkline already owns a `type` prop, so its variant is exposed as `sparklineType`. */
type SparklineMember = { type: "sparkline"; sparklineType?: SparklineType } & Omit<SparklineProps, "type">;

export type ChartProps =
  | ({ type?: "line" } & LineChartProps)
  | ({ type: "area" } & AreaChartProps)
  | ({ type: "bar" } & BarChartProps)
  | ({ type: "donut" } & DonutChartProps)
  | ({ type: "radar" } & RadarChartProps)
  | ({ type: "funnel" } & FunnelChartProps)
  | SparklineMember;

export function Chart(props: ChartProps) {
  switch (props.type) {
    case "area": {
      const { type: _t, ...rest } = props;
      return <AreaChart {...rest} />;
    }
    case "bar": {
      const { type: _t, ...rest } = props;
      return <BarChart {...rest} />;
    }
    case "donut": {
      const { type: _t, ...rest } = props;
      return <DonutChart {...rest} />;
    }
    case "radar": {
      const { type: _t, ...rest } = props;
      return <RadarChart {...rest} />;
    }
    case "funnel": {
      const { type: _t, ...rest } = props;
      return <FunnelChart {...rest} />;
    }
    case "sparkline": {
      const { type: _t, sparklineType, ...rest } = props;
      return <Sparkline type={sparklineType} {...rest} />;
    }
    default: {
      const { type: _t, ...rest } = props;
      return <LineChart {...rest} />;
    }
  }
}
