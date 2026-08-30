"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

// ── Context ───────────────────────────────────────────────────────────────────
const DialogOpenContext = React.createContext(false);

// ── Root (tracks open state for AnimatePresence) ──────────────────────────────
function Dialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen ?? false);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp! : uncontrolled;

  return (
    <DialogOpenContext.Provider value={isOpen}>
      <DialogPrimitive.Root
        open={isControlled ? openProp : uncontrolled}
        defaultOpen={defaultOpen}
        onOpenChange={(v) => {
          if (!isControlled) setUncontrolled(v);
          onOpenChange?.(v);
        }}
        {...props}
      />
    </DialogOpenContext.Provider>
  );
}
Dialog.displayName = "Dialog";

// ── Primitive re-exports ──────────────────────────────────────────────────────
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// ── Direction offsets ─────────────────────────────────────────────────────────
const fromOffset: Record<"top" | "bottom" | "left" | "right", { x?: number; y?: number }> = {
  top: { y: -20 },
  bottom: { y: 20 },
  left: { x: -20 },
  right: { x: 20 },
};

// ── DialogOverlay ─────────────────────────────────────────────────────────────
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      className={cn("fixed grid place-items-center overflow-auto inset-0 z-50 bg-black/80", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// ── DialogContent ─────────────────────────────────────────────────────────────
interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  from?: "top" | "bottom" | "left" | "right";
  transition?: Transition;
  /** Set to `false` when the caller renders its own <DialogClose> (avoids a duplicate X button). @default true */
  showCloseButton?: boolean;
}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, from = "top", transition, showCloseButton = true, ...props }, ref) => {
    const isOpen = React.useContext(DialogOpenContext);
    const offset = fromOffset[from];
    const defaultTransition: Transition = { type: "spring", stiffness: 150, damping: 25 };

    return (
      <DialogPortal>
        <AnimatePresence>
          {isOpen && (
            <>
              <DialogOverlay key="dialog-overlay" />
              <DialogPrimitive.Content
                key="dialog-content"
                ref={ref}
                forceMount
                className={cn(
                  "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
                  className
                )}
                {...props}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, ...offset }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, ...offset }}
                  transition={transition ?? defaultTransition}
                  className="contents"
                >
                  {children}
                </motion.div>
                {showCloseButton && (
                  <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                )}
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// ── Layout helpers ────────────────────────────────────────────────────────────
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
