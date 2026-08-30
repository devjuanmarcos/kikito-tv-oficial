"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Context tracks open state from the Root's onOpenChange — no DOM observation needed
const PopoverOpenContext = React.createContext(false);

const Popover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>
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
    <PopoverOpenContext.Provider value={resolvedOpen}>
      <PopoverPrimitive.Root
        open={controlledOpen}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopoverOpenContext.Provider>
  );
});
Popover.displayName = PopoverPrimitive.Root.displayName;

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const isOpen = React.useContext(PopoverOpenContext);

  return (
    <PopoverPrimitive.Portal forceMount>
      <PopoverPrimitive.Content
        ref={ref}
        forceMount
        align={align}
        sideOffset={sideOffset}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        className="z-50 outline-none"
        {...props}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
