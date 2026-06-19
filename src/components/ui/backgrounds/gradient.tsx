"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

type GradientBackgroundProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
};

function GradientBackground({
  className,
  transition = { duration: 15, ease: "easeInOut", repeat: Infinity },
  children,
  ...props
}: GradientBackgroundProps) {
  return (
    <motion.div
      data-slot="gradient-background"
      className={cn(
        "size-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-[length:400%_400%]",
        className
      )}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { GradientBackground, type GradientBackgroundProps };
