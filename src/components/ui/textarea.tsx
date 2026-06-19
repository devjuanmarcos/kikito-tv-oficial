import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full min-h-[80px] border border-border placeholder:text-muted-foreground placeholder:opacity-50 text-body-callout rounded-lg body-paragraph-bold-regular focus:outline-none focus:border-[.0625rem] block px-3 py-2 bg-background autofill:bg-background focus:bg-background disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
