"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { motion } from "motion/react";
import * as React from "react";

import type { MotionSafeProps } from "@/lib/motion-safe-props";
import { cn } from "@/lib/utils";

const MotionAvatarRoot = motion(AvatarPrimitive.Root);

interface AvatarProps extends MotionSafeProps<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>> {
  interactive?: boolean;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, interactive = false, ...props }, ref) => {
    if (interactive) {
      return (
        <MotionAvatarRoot
          ref={ref}
          className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...props}
        />
      );
    }
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      />
    );
  }
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted-surface", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
