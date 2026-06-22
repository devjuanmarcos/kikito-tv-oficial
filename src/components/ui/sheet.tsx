"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

// ── Context ───────────────────────────────────────────────────────────────────
const SheetOpenContext = React.createContext(false);

// ── Root (tracks open state) ──────────────────────────────────────────────────
function Sheet({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp! : uncontrolled;

  return (
    <SheetOpenContext.Provider value={isOpen}>
      <SheetPrimitive.Root
        open={isControlled ? openProp : uncontrolled}
        defaultOpen={defaultOpen}
        onOpenChange={(v) => {
          if (!isControlled) setUncontrolled(v);
          onOpenChange?.(v);
        }}
        {...props}
      />
    </SheetOpenContext.Provider>
  );
}
Sheet.displayName = "Sheet";

// ── Primitive re-exports ──────────────────────────────────────────────────────
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

// ── Overlay ───────────────────────────────────────────────────────────────────
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    asChild
    {...props}
  >
    <motion.div
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  </SheetPrimitive.Overlay>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// ── Side offset map ───────────────────────────────────────────────────────────
const sideVariants: Record<"top" | "bottom" | "left" | "right", { x?: string; y?: string }> = {
  right: { x: "100%" },
  left: { x: "-100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
};

// ── CVA (structural classes only, no animation classes) ───────────────────────
const sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
      left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    },
  },
  defaultVariants: {
    side: "right",
  },
});

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    const isOpen = React.useContext(SheetOpenContext);
    const resolvedSide = side ?? "right";
    const slideOffset = sideVariants[resolvedSide];

    return (
      <SheetPortal>
        <AnimatePresence>
          {isOpen && (
            <>
              <SheetOverlay key="sheet-overlay" />
              <SheetPrimitive.Content
                key="sheet-content"
                ref={ref}
                forceMount
                asChild
                {...props}
              >
                <motion.div
                  className={cn(sheetVariants({ side }), className)}
                  initial={{ ...slideOffset }}
                  animate={{ x: 0, y: 0 }}
                  exit={{ ...slideOffset }}
                  transition={{ type: "spring", stiffness: 150, damping: 22 }}
                >
                  {children}
                  <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </SheetPrimitive.Close>
                </motion.div>
              </SheetPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

// ── Layout helpers ────────────────────────────────────────────────────────────
const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
