"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      setIsOpen(el.dataset.state === "delayed-open" || el.dataset.state === "instant-open");
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] });
    const state = el.dataset.state;
    setIsOpen(state === "delayed-open" || state === "instant-open");
    return () => observer.disconnect();
  }, []);

  return (
    <TooltipPrimitive.Content
      ref={(node) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      forceMount
      sideOffset={sideOffset}
      className="z-50 outline-none"
      {...props}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-white",
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipPrimitive.Content>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
