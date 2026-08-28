import { cn } from "@/lib/utils";

import type { LabelProps, LabelSize } from "./label.types";

const SIZE: Record<LabelSize, string> = {
  sm: "text-body-caption",
  md: "text-body-callout",
  lg: "text-body-paragraph",
};

export function Label({
  size = "md",
  required = false,
  optional = false,
  hint,
  disabled = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <div className="flex flex-col gap-(--spacing-3xs)">
      <label
        {...props}
        className={cn(
          "inline-flex items-center gap-(--spacing-2xs) font-medium text-foreground cursor-pointer",
          SIZE[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {children}
        {required && (
          <span aria-hidden="true" className="text-danger leading-none">
            *
          </span>
        )}
        {optional && !required && <span className="text-muted font-normal text-body-caption">(optional)</span>}
      </label>
      {hint && <p className="text-body-caption text-muted">{hint}</p>}
    </div>
  );
}

Label.displayName = "Label";
