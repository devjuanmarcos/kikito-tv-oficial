import { cn } from "@/lib/utils";
import React from "react";

export interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  /** Apply radial fade mask (softer edges). Default true. */
  withFade?: boolean;
}

/**
 * Full-width grid pattern background (light/dark). Use as wrapper for sections
 * that need the same visual as GridBackgroundDemo without the demo content.
 */
export function GridBackground({ children, className, withFade = true }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative w-full min-h-[200px] bg-background",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {withFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
          aria-hidden
        />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
