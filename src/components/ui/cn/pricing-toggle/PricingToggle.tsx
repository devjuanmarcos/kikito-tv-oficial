"use client";

import { useState } from "react";
import type React from "react";

import { cn } from "@/lib/utils";

import type { PricingToggleProps } from "./pricing-toggle.types";

export function PricingToggle({
  value,
  onChange,
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  savingsLabel,
  className,
  style,
}: PricingToggleProps) {
  const [internal, setInternal] = useState<"monthly" | "yearly">("monthly");
  const current = value ?? internal;

  function toggle(next: "monthly" | "yearly") {
    if (!value) setInternal(next);
    onChange?.(next);
  }

  function handleLabelKeyDown(e: React.KeyboardEvent, next: "monthly" | "yearly") {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(next);
    }
  }

  return (
    <div className={cn("flex items-center gap-(--spacing-md)", className)} style={style}>
      <span
        role="button"
        tabIndex={0}
        className={cn(
          "text-body-callout font-medium cursor-pointer transition-colors",
          current === "monthly" ? "text-foreground" : "text-faint"
        )}
        onClick={() => toggle("monthly")}
        onKeyDown={(e) => handleLabelKeyDown(e, "monthly")}
      >
        {monthlyLabel}
      </span>

      <button
        type="button"
        onClick={() => toggle(current === "monthly" ? "yearly" : "monthly")}
        role="switch"
        aria-checked={current === "yearly"}
        aria-label={current === "yearly" ? `Switch to ${monthlyLabel}` : `Switch to ${yearlyLabel}`}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors focus:outline-none",
          current === "yearly" ? "bg-patina" : "bg-graphite"
        )}
      >
        <span
          aria-hidden="true"
          className="absolute top-(--spacing-3xs) left-(--spacing-3xs) w-5 h-5 bg-canvas rounded-full shadow-sm transition-transform"
          style={{ transform: current === "yearly" ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>

      <span
        role="button"
        tabIndex={0}
        className={cn(
          "text-body-callout font-medium cursor-pointer transition-colors",
          current === "yearly" ? "text-foreground" : "text-faint"
        )}
        onClick={() => toggle("yearly")}
        onKeyDown={(e) => handleLabelKeyDown(e, "yearly")}
      >
        {yearlyLabel}
      </span>

      {savingsLabel && current === "yearly" && (
        <span className="text-body-caption font-semibold px-(--spacing-sm) py-(--spacing-3xs) rounded-full bg-success/15 text-success">
          {savingsLabel}
        </span>
      )}
    </div>
  );
}
