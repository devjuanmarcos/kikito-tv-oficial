"use client";
import { cn } from "@/lib/utils";

import type {
  StatProps,
  StatSingleProps,
  StatMetricProps,
  StatGridProps,
  StatTrend,
  MetricIntent,
  MetricTrend,
} from "./stat.types";

const TrendUp = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const TrendDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);
const TrendFlat = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3 h-3"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TREND_ICONS: Record<StatTrend, React.ReactNode> = {
  up: <TrendUp />,
  down: <TrendDown />,
  neutral: <TrendFlat />,
};

const TREND_CLS: Record<StatTrend, string> = {
  up: "bg-success/10 text-success",
  down: "bg-danger/10 text-danger",
  neutral: "bg-graphite text-muted",
};

const ACCENT_CLS: Record<string, string> = {
  primary: "text-patina bg-patina/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-danger bg-danger/10",
  default: "text-patina bg-patina/10",
};

/* ── single mode (default) ──────────────────────────────────────────────── */
function SingleStat({
  label,
  value,
  description,
  trend,
  trendValue,
  icon,
  intent = "default",
  loading = false,
  className,
  style,
}: StatSingleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-6 py-5 rounded-(--radius-md) border border-rule bg-raised min-w-[180px]",
        className
      )}
      style={style}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-body-callout font-medium text-muted tracking-[0.01em] leading-snug">{label}</span>
        {icon && (
          <span
            className={cn(
              "w-9 h-9 rounded-(--radius-sm) flex items-center justify-center shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]",
              ACCENT_CLS[intent] ?? ACCENT_CLS.default
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-8 w-20 bg-graphite rounded-(--radius-sm) animate-pulse" />
      ) : (
        <div className="text-heading-03 font-bold text-foreground leading-none tabular-nums tracking-tight">
          {value}
        </div>
      )}

      {(trend || description) && (
        <div className="flex items-center gap-2 flex-wrap">
          {loading ? (
            <div className="h-5 w-16 bg-graphite rounded-full animate-pulse" />
          ) : (
            trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-[3px] text-body-caption font-semibold py-0.5 px-2 rounded-full",
                  TREND_CLS[trend]
                )}
              >
                {TREND_ICONS[trend]}
                {trendValue}
              </span>
            )
          )}
          {!loading && description && <span className="text-body-caption text-faint leading-snug">{description}</span>}
        </div>
      )}
    </div>
  );
}

/* ── metric mode (absorbed MetricCard, verbatim) ────────────────────────── */
const INTENT_SPARK: Record<MetricIntent, string> = {
  primary: "stroke-patina",
  success: "stroke-success",
  warning: "stroke-warning",
  danger: "stroke-danger",
  info: "stroke-info",
  neutral: "stroke-foreground/40",
};

const METRIC_TREND_CLS: Record<MetricTrend, string> = {
  up: "text-success",
  down: "text-danger",
  flat: "text-faint",
};
const METRIC_TREND_ARROW: Record<MetricTrend, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

function Sparkline({ data, intent }: { data: number[]; intent: MetricIntent }) {
  const min = Math.min(...data);
  const max = Math.max(...data) - min || 1;
  const w = 80;
  const h = 28;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / max) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={INTENT_SPARK[intent]}
      />
    </svg>
  );
}

function MetricStat({
  label,
  value,
  unit,
  trend,
  trendValue,
  trendLabel = "vs last period",
  sparkline,
  intent = "primary",
  loading = false,
  description,
  className,
  style,
}: StatMetricProps) {
  return (
    <div style={style} className={cn("flex flex-col gap-3 p-4 rounded-xl border border-rule bg-raised", className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-body-caption text-faint">{label}</span>
        {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} intent={intent} />}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-24 rounded-(--radius-sm) bg-graphite-2 animate-pulse" />
          <div className="h-4 w-16 rounded-(--radius-sm) bg-graphite-2 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
            {unit && <span className="text-body-caption text-faint">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn("text-body-caption font-medium", METRIC_TREND_CLS[trend])}>
                {METRIC_TREND_ARROW[trend]} {trendValue}
              </span>
              <span className="text-body-caption text-faint">{trendLabel}</span>
            </div>
          )}
        </>
      )}

      {description && <p className="text-body-caption text-faint border-t border-rule pt-2">{description}</p>}
    </div>
  );
}

/* ── grid mode (absorbed StatsCard, verbatim) ───────────────────────────── */
const GRID_TREND_CLS: Record<StatTrend, string> = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-faint",
};
const GRID_TREND_ARROW: Record<StatTrend, string> = {
  up: "↑",
  down: "↓",
  neutral: "·",
};

const COLS_CLS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

function GridStat({ stats, cols = 3, className, style }: StatGridProps) {
  return (
    <div
      style={style}
      className={cn(
        "grid divide-x divide-rule border border-rule rounded-xl overflow-hidden bg-raised",
        COLS_CLS[cols],
        className
      )}
    >
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-1.5 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-body-caption text-faint">{stat.label}</span>
            {stat.icon && <span className="text-lg leading-none">{stat.icon}</span>}
          </div>
          <span className="text-xl font-bold text-foreground">{stat.value}</span>
          {stat.change && (
            <span
              className={cn("text-body-caption font-medium", stat.trend ? GRID_TREND_CLS[stat.trend] : "text-faint")}
            >
              {stat.trend && stat.trend !== "neutral" ? GRID_TREND_ARROW[stat.trend] + " " : ""}
              {stat.change}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Stat — Super component.
 * `mode` (default 'single') dispatches between single-value, metric (unit +
 * sparkline) and grid (grid of stats) renderers.
 * Absorbs the former MetricCard (`mode="metric"`) and StatsCard (`mode="grid"`),
 * both now backward-compat wrappers.
 */
export function Stat(props: StatProps) {
  if (props.mode === "metric") return <MetricStat {...props} />;
  if (props.mode === "grid") return <GridStat {...props} />;
  return <SingleStat {...props} />;
}
