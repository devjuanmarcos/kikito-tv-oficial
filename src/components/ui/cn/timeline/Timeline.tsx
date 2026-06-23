"use client";
import React from "react";

import { cn } from "@/lib/utils";

import type {
  TimelineProps,
  TimelineDefaultProps,
  TimelineStatus,
  TimelineStepStatus,
  ScrollTimelineProps,
  TimelineProgressProps,
  ActivityFeedProps,
} from "./timeline.types";

/* ════════════════════════════════════════════════════════════════════════
   DEFAULT family — classic vertical timeline
   ════════════════════════════════════════════════════════════════════════ */

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ActiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
  </svg>
);
const PendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
  </svg>
);
const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const WarnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const DEFAULT_ICONS: Record<TimelineStatus, React.ReactNode> = {
  complete: <CheckIcon />,
  active: <ActiveIcon />,
  pending: <PendingIcon />,
  error: <ErrorIcon />,
  warning: <WarnIcon />,
};

const NODE_STATUS_CLS: Record<TimelineStatus, string> = {
  complete: "bg-success-soft text-success border-[1.5px] border-success",
  active: "bg-patina-soft text-patina border-2 border-patina shadow-[0_0_0_4px_var(--ks-primary-soft)]",
  pending: "bg-graphite text-faint border-[1.5px] border-dashed border-rule",
  error: "bg-danger-soft text-danger border-[1.5px] border-danger",
  warning: "bg-warning-soft text-warning border-[1.5px] border-warning",
};

const LINE_STATUS_CLS: Record<TimelineStatus, string> = {
  complete: "bg-success opacity-40",
  active: "bg-rule",
  pending: "bg-rule",
  error: "bg-danger opacity-30",
  warning: "bg-rule",
};

const TITLE_STATUS_CLS: Record<TimelineStatus, string> = {
  complete: "text-foreground",
  active: "text-foreground",
  pending: "text-muted",
  error: "text-foreground",
  warning: "text-foreground",
};

function DefaultTimeline({ items, variant = "default", lastLine = false, className, style }: TimelineDefaultProps) {
  const isCompact = variant === "compact";
  const isReverse = variant === "reverse";

  const nodeSz = isCompact ? "w-6 h-6 [&>svg]:w-3 [&>svg]:h-3" : "w-8 h-8 [&>svg]:w-4 [&>svg]:h-4";
  const stemW = isCompact ? "w-6" : "w-8";

  return (
    <ol className={cn("list-none p-0 m-0 flex flex-col", className)} style={style}>
      {items.map((item, i) => {
        const status: TimelineStatus = item.status ?? "pending";
        const isLast = i === items.length - 1;

        return (
          <li key={item.id ?? i} className="grid gap-x-4" style={{ gridTemplateColumns: "auto 1fr" }}>
            <div className={cn("flex flex-col items-center shrink-0", stemW)}>
              <span
                className={cn(
                  "rounded-full flex items-center justify-center shrink-0 text-body-callout relative z-[1] transition-[background] duration-[160ms]",
                  nodeSz,
                  NODE_STATUS_CLS[status]
                )}
              >
                {item.icon ?? DEFAULT_ICONS[status]}
              </span>
              {(!isLast || lastLine) && (
                <div
                  className={cn(
                    "flex-1 w-[2px] my-1 min-h-4 transition-[background] duration-[160ms]",
                    LINE_STATUS_CLS[status]
                  )}
                />
              )}
            </div>

            <div className={cn("min-w-0", isLast ? "pb-0" : isCompact ? "pb-[0.875rem]" : "pb-6")}>
              <div
                className={cn("flex items-start justify-between gap-3 min-h-8 pt-1", isReverse && "flex-row-reverse")}
              >
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span
                    className={cn(
                      "font-semibold leading-snug",
                      isCompact ? "text-body-callout" : "text-body-paragraph",
                      TITLE_STATUS_CLS[status]
                    )}
                  >
                    {item.title}
                  </span>
                  {item.badge && <span className="shrink-0">{item.badge}</span>}
                </div>
                {item.timestamp && (
                  <time className="text-body-caption text-faint whitespace-nowrap shrink-0 pt-[3px] tabular-nums">
                    {item.timestamp}
                  </time>
                )}
              </div>
              {item.description && (
                <div className={cn("text-muted leading-relaxed mt-1 text-body-callout")}>{item.description}</div>
              )}
              {item.actions && <div className="flex gap-2 flex-wrap mt-[0.625rem]">{item.actions}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SCROLL family — absorbed from ScrollTimeline
   ════════════════════════════════════════════════════════════════════════ */

const SCROLL_INTENT_DOT: Record<string, string> = {
  primary: "border-patina text-patina",
  secondary: "border-kinpaku text-kinpaku",
  tertiary: "border-violet text-violet",
  quaternary: "border-rose text-rose",
  success: "border-success text-success",
  warning: "border-warning text-warning",
  danger: "border-danger text-danger",
  info: "border-info text-info",
};

const SCROLL_LINE_CLS: Record<string, string> = {
  alternating: "before:left-1/2 before:-translate-x-1/2",
  left: "before:left-5 before:translate-x-0",
  right: "before:right-5 before:left-auto before:translate-x-0",
};

function ScrollTimelineImpl({ events, orientation = "alternating", className, style }: ScrollTimelineProps) {
  return (
    <div
      className={cn(
        "relative py-2",
        'before:content-[""] before:absolute before:top-0 before:bottom-0 before:w-[2px] before:bg-rule',
        SCROLL_LINE_CLS[orientation] ?? SCROLL_LINE_CLS.alternating,
        className
      )}
      style={style}
      role="list"
    >
      {events.map((event, idx) => {
        const intent = event.intent ?? "neutral";
        const isOdd = idx % 2 === 0;
        const isAlt = orientation === "alternating";
        const dotCls = SCROLL_INTENT_DOT[intent] ?? "";

        return (
          <div
            key={event.id}
            className={cn(
              "flex items-start gap-4 relative mb-8",
              isAlt && isOdd && "flex-row-reverse",
              orientation === "left" && "pl-12",
              orientation === "right" && "pr-12 justify-end"
            )}
            role="listitem"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-full bg-raised border-2 border-rule flex items-center justify-center flex-shrink-0 z-[1] text-body-paragraph text-muted transition-[border-color] duration-200",
                dotCls
              )}
            >
              {event.icon ?? "●"}
            </div>
            <div className="flex-1 bg-raised border border-rule rounded-(--radius-md) px-4 py-3 min-w-0">
              <div className="text-body-caption text-muted mb-1 font-semibold uppercase tracking-[0.06em]">
                {event.date}
              </div>
              <div className="text-body-callout font-semibold text-foreground mb-1">{event.title}</div>
              {event.description && (
                <div className="text-body-callout text-muted leading-[1.5]">{event.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PROGRESS family — absorbed from TimelineProgress
   ════════════════════════════════════════════════════════════════════════ */

const PROGRESS_STATUS_CIRCLE: Record<TimelineStepStatus, string> = {
  completed: "bg-success border-success text-success-fg",
  current: "bg-transparent border-patina text-patina ring-4 ring-patina/20",
  upcoming: "bg-transparent border-rule text-faint",
  error: "bg-danger border-danger text-danger-fg",
};
const PROGRESS_STATUS_LINE: Record<TimelineStepStatus, string> = {
  completed: "bg-success",
  current: "bg-rule",
  upcoming: "bg-rule",
  error: "bg-danger",
};

const ProgressCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ProgressXIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

function TimelineProgressImpl({ steps, orientation = "horizontal", className, style }: TimelineProgressProps) {
  const isVertical = orientation === "vertical";

  return (
    <div style={style} className={cn("flex", isVertical ? "flex-col gap-0" : "items-start", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} className={cn("flex", isVertical ? "flex-row gap-3" : "flex-col items-center flex-1")}>
            {/* Node + connector */}
            <div className={cn(isVertical ? "flex flex-col items-center" : "flex items-center w-full")}>
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 transition-all duration-[200ms] font-semibold text-xs",
                  PROGRESS_STATUS_CIRCLE[step.status]
                )}
              >
                {step.icon && step.status === "upcoming" ? (
                  <span className="text-sm leading-none">{step.icon}</span>
                ) : step.status === "completed" ? (
                  <ProgressCheckIcon />
                ) : step.status === "error" ? (
                  <ProgressXIcon />
                ) : step.icon ? (
                  <span className="text-sm leading-none">{step.icon}</span>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "transition-[background] duration-[200ms]",
                    isVertical ? "w-px h-8 mx-auto" : "flex-1 h-px mx-2",
                    PROGRESS_STATUS_LINE[step.status]
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn(isVertical ? "pb-6 pt-1.5" : "mt-2 text-center")}>
              <p
                className={cn(
                  "text-body-callout font-medium",
                  step.status === "upcoming" ? "text-faint" : "text-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && <p className="text-body-caption text-faint">{step.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ACTIVITY family — absorbed from ActivityFeed
   ════════════════════════════════════════════════════════════════════════ */

const ACTIVITY_INTENT_COLOR: Record<string, string> = {
  primary: "var(--ks-primary)",
  secondary: "var(--ks-kinpaku)",
  success: "var(--ks-success)",
  warning: "var(--ks-warning)",
  danger: "var(--ks-danger)",
  info: "var(--ks-info)",
  neutral: "var(--ks-text-muted)",
};

const ActivityDefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
  </svg>
);

function ActivityFeedImpl({ items, compact = false, className, style }: ActivityFeedProps) {
  const pad = compact ? "py-2 gap-[10px]" : "py-3 gap-3";
  const sz = compact ? "w-6 h-6" : "w-[30px] h-[30px]";
  const svgSz = compact ? "[&>svg]:w-3 [&>svg]:h-3" : "[&>svg]:w-[14px] [&>svg]:h-[14px]";
  const stemL = compact ? "left-3" : "left-[15px]";
  const stemT = compact ? "top-9" : "top-11";

  return (
    <div className={cn("w-full", className)} style={style}>
      <div className="flex flex-col">
        {items.map((item, idx) => {
          const intent = item.intent ?? "primary";
          const color = ACTIVITY_INTENT_COLOR[intent] ?? "var(--ks-primary)";
          const isLast = idx === items.length - 1;

          return (
            <div key={item.id} className={cn("flex relative", pad)}>
              {!isLast && <div className={cn("absolute bottom-0 w-px bg-rule", stemL, stemT)} />}
              {item.avatar ? (
                <div
                  className={cn("rounded-full shrink-0 z-[1]", sz)}
                  style={{ backgroundImage: `url(${item.avatar})`, backgroundSize: "cover" }}
                />
              ) : item.avatarFallback ? (
                <div
                  className={cn(
                    "rounded-full shrink-0 z-[1] flex items-center justify-center bg-patina text-patina-fg text-body-caption font-bold",
                    sz
                  )}
                >
                  {item.avatarFallback[0].toUpperCase()}
                </div>
              ) : (
                <div
                  className={cn("rounded-full shrink-0 z-[1] flex items-center justify-center border", sz, svgSz)}
                  style={{
                    background: `color-mix(in srgb,${color} 15%,var(--ks-lacquer-raised))`,
                    borderColor: `color-mix(in srgb,${color} 30%,transparent)`,
                    color,
                  }}
                >
                  {item.icon ?? <ActivityDefaultIcon />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-body-callout text-foreground leading-normal">{item.title}</p>
                {item.description && (
                  <p className="text-body-caption text-muted opacity-70 mt-[2px] leading-snug">{item.description}</p>
                )}
              </div>

              <span className="text-body-caption text-muted opacity-45 whitespace-nowrap mt-[2px] shrink-0">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Timeline — Super component.
   `variant` dispatches the family:
     'default' | 'compact' | 'reverse'  → classic vertical timeline
     'scroll'                            → absorbed ScrollTimeline
     'progress'                          → absorbed TimelineProgress
     'activity'                          → absorbed ActivityFeed
   ════════════════════════════════════════════════════════════════════════ */
export function Timeline(props: TimelineProps) {
  switch (props.variant) {
    case "scroll":
      return <ScrollTimelineImpl {...props} />;
    case "progress":
      return <TimelineProgressImpl {...props} />;
    case "activity":
      return <ActivityFeedImpl {...props} />;
    default:
      return <DefaultTimeline {...props} />;
  }
}
