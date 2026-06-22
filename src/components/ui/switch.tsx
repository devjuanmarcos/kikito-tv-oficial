"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      setChecked(el.dataset.state === "checked");
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] });
    setChecked(el.dataset.state === "checked");
    return () => observer.disconnect();
  }, []);

  return (
    <SwitchPrimitives.Root
      ref={(node) => {
        (rootRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
    >
      <motion.span
        className="pointer-events-none block h-5 rounded-full bg-background shadow-lg ring-0"
        animate={{
          x: checked ? 20 : 0,
          width: 20,
        }}
        whileTap={{ width: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
