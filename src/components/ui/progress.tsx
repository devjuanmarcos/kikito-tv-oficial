"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <motion.div
      className="h-full bg-primary rounded-full"
      animate={{ width: `${value || 0}%` }}
      transition={{ type: "spring", stiffness: 150, damping: 30 }}
      style={{ originX: 0 }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
