"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

// Context tracks open state from the Root's onOpenChange — no DOM observation needed
const TooltipOpenContext = React.createContext(false);

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
>(({ onOpenChange, open: controlledOpen, defaultOpen, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(controlledOpen ?? defaultOpen ?? false);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const resolvedOpen = controlledOpen ?? isOpen;

  return (
    <TooltipOpenContext.Provider value={resolvedOpen}>
      <TooltipPrimitive.Root
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </TooltipOpenContext.Provider>
  );
});
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const isOpen = React.useContext(TooltipOpenContext);

  return (
    <TooltipPrimitive.Content
      ref={ref}
      forceMount
      sideOffset={sideOffset}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
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
            className={cn("overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-white", className)}
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
