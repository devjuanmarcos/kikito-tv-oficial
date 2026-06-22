"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";

type RippleItem = { id: number; x: number; y: number };

export interface RippleButtonProps extends Omit<ButtonProps, "asChild"> {
  rippleColor?: string;
  hoverScale?: number;
  tapScale?: number;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      className,
      children,
      rippleColor = "rgba(255,255,255,0.4)",
      hoverScale = 1.05,
      tapScale = 0.95,
      variant,
      size,
      intent,
      appearance,
      loading = false,
      loadingText,
      icon: Icon,
      onClick,
      disabled,
      disableAnimation = false,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<RippleItem[]>([]);
    const nextId = React.useRef(0);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = nextId.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      onClick?.(e);
    };

    const motionProps = disableAnimation
      ? {}
      : {
          whileHover: { scale: hoverScale },
          whileTap: { scale: tapScale },
          transition: { type: "spring", stiffness: 400, damping: 17 },
        };

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, intent, appearance }),
          "relative overflow-hidden",
          className
        )}
        {...motionProps}
        onClick={handleClick}
        disabled={loading || disabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>{loadingText || "Carregando..."}</span>
          </>
        ) : (
          <>
            {Icon && <Icon />}
            {children}
          </>
        )}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                x: "-50%",
                y: "-50%",
                background: rippleColor,
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 10, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationComplete={() => {
                setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
              }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    );
  }
);
RippleButton.displayName = "RippleButton";

export { RippleButton };
