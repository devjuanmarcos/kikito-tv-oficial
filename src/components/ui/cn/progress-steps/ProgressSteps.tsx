"use client";
import { cn } from "@/lib/utils";

import type { ProgressStepsProps, ProgressStepsSize, ProgressStepStatus } from "./progress-steps.types";

// escala própria do componente por tamanho (sm/md/lg), não migra pra spacing genérico
const SIZE_CIRCLE: Record<ProgressStepsSize, string> = {
  sm: "w-6 h-6 text-[0.6rem]", // below scale minimum: dígito do passo num círculo minúsculo
  md: "w-8 h-8 text-body-caption",
  lg: "w-10 h-10 text-body-callout",
};
const SIZE_LABEL: Record<ProgressStepsSize, string> = {
  sm: "text-[0.7rem]", // below scale minimum
  md: "text-body-caption",
  lg: "text-body-callout",
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className="w-3 h-3">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ProgressSteps({
  steps,
  current,
  orientation = "horizontal",
  size = "md",
  className,
  style,
}: ProgressStepsProps) {
  const isVertical = orientation === "vertical";

  function resolveStatus(i: number, overrideStatus?: ProgressStepStatus): ProgressStepStatus {
    if (overrideStatus) return overrideStatus;
    if (i < current) return "complete";
    if (i === current) return "current";
    return "upcoming";
  }

  return (
    <div style={style} className={cn("flex", isVertical ? "flex-col gap-0" : "items-start", className)}>
      {steps.map((step, i) => {
        const status = resolveStatus(i, step.status);
        const isLast = i === steps.length - 1;

        return (
          <div
            key={i}
            aria-current={status === "current" ? "step" : undefined}
            className={cn("flex", isVertical ? "flex-row gap-(--spacing-md)" : "flex-col items-center flex-1")}
          >
            {/* Circle + connector */}
            <div className={cn(isVertical ? "flex flex-col items-center" : "flex items-center w-full")}>
              {/* Circle */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full flex-shrink-0 font-semibold border-2 transition-[background,border-color] duration-[200ms]",
                  SIZE_CIRCLE[size],
                  status === "complete" && "bg-patina border-patina text-patina-fg",
                  status === "current" && "bg-transparent border-patina text-patina",
                  status === "upcoming" && "bg-transparent border-rule text-faint"
                )}
              >
                {status === "complete" ? <CheckIcon /> : <span>{i + 1}</span>}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "transition-[background] duration-[200ms]",
                    isVertical ? "w-px h-8 mx-auto" : "flex-1 h-px mx-(--spacing-sm)",
                    status === "complete" ? "bg-patina" : "bg-rule"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className={cn(isVertical ? "pb-(--spacing-lg)" : "mt-(--spacing-sm) text-center")}>
              <p
                className={cn(
                  "font-medium transition-colors duration-[200ms]",
                  SIZE_LABEL[size],
                  status === "upcoming" ? "text-faint" : "text-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p
                  className={cn(
                    "text-faint",
                    // text-[0.65rem]: below scale minimum
                    size === "sm" ? "text-[0.65rem]" : "text-body-caption"
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
