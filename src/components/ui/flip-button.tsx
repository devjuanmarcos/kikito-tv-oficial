"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";

type FlipFrom = "top" | "bottom" | "left" | "right";

export interface FlipButtonProps extends Omit<ButtonProps, "children" | "asChild"> {
  front: React.ReactNode;
  back: React.ReactNode;
  from?: FlipFrom;
  tapScale?: number;
}

const getOffsets = (from: FlipFrom) => {
  const initial: Record<FlipFrom, { x?: string; y?: string }> = {
    top: { y: "-110%" },
    bottom: { y: "110%" },
    left: { x: "-110%" },
    right: { x: "110%" },
  };
  const frontExit: Record<FlipFrom, { x?: string; y?: string }> = {
    top: { y: "110%" },
    bottom: { y: "-110%" },
    left: { x: "110%" },
    right: { x: "-110%" },
  };
  return { initial: initial[from], frontExit: frontExit[from] };
};

const FlipButton = React.forwardRef<HTMLButtonElement, FlipButtonProps>(
  (
    {
      front,
      back,
      from = "top",
      tapScale = 0.95,
      variant,
      size,
      intent,
      appearance,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const { initial, frontExit } = getOffsets(from);
    const spring = { type: "spring", stiffness: 280, damping: 20 } as const;

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, intent, appearance }),
          "relative overflow-hidden",
          className
        )}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: tapScale }}
        disabled={disabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {/* Front face */}
        <motion.span
          className="flex items-center justify-center w-full h-full gap-2"
          variants={{
            rest: { x: "0%", y: "0%", opacity: 1 },
            hover: { ...frontExit, opacity: 0 },
          }}
          transition={spring}
        >
          {front}
        </motion.span>

        {/* Back face */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center gap-2"
          variants={{
            rest: { ...initial, opacity: 0 },
            hover: { x: "0%", y: "0%", opacity: 1 },
          }}
          transition={spring}
        >
          {back}
        </motion.span>
      </motion.button>
    );
  }
);
FlipButton.displayName = "FlipButton";

export { FlipButton };
