import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeIntents = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "neutral",
  "success",
  "warning",
  "destructive",
  "info",
] as const;

const solidVariants = {
  primary: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  tertiary: "border-transparent bg-tertiary text-tertiary-foreground",
  quaternary: "border-transparent bg-quaternary text-quaternary-foreground",
  neutral: "border-transparent bg-neutral text-neutral-foreground",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  info: "border-transparent bg-info text-info-foreground",
} satisfies Record<(typeof badgeIntents)[number], string>;

const softVariants = {
  primary: "border-transparent bg-primary-soft text-primary-soft-foreground",
  secondary: "border-transparent bg-secondary-soft text-secondary-soft-foreground",
  tertiary: "border-transparent bg-tertiary-soft text-tertiary-soft-foreground",
  quaternary: "border-transparent bg-quaternary-soft text-quaternary-soft-foreground",
  neutral: "border-transparent bg-neutral-soft text-neutral-soft-foreground",
  success: "border-transparent bg-success-soft text-success-soft-foreground",
  warning: "border-transparent bg-warning-soft text-warning-soft-foreground",
  destructive: "border-transparent bg-destructive-soft text-destructive-soft-foreground",
  info: "border-transparent bg-info-soft text-info-soft-foreground",
} satisfies Record<(typeof badgeIntents)[number], string>;

const outlineVariants = {
  primary: "border-primary bg-transparent text-primary",
  secondary: "border-secondary bg-transparent text-secondary",
  tertiary: "border-tertiary bg-transparent text-tertiary",
  quaternary: "border-quaternary bg-transparent text-quaternary",
  neutral: "border-neutral bg-transparent text-neutral",
  success: "border-success bg-transparent text-success",
  warning: "border-warning bg-transparent text-warning",
  destructive: "border-destructive bg-transparent text-destructive",
  info: "border-info bg-transparent text-info",
} satisfies Record<(typeof badgeIntents)[number], string>;

const ghostVariants = {
  primary: "border-transparent bg-transparent text-primary",
  secondary: "border-transparent bg-transparent text-secondary",
  tertiary: "border-transparent bg-transparent text-tertiary",
  quaternary: "border-transparent bg-transparent text-quaternary",
  neutral: "border-transparent bg-transparent text-neutral",
  success: "border-transparent bg-transparent text-success",
  warning: "border-transparent bg-transparent text-warning",
  destructive: "border-transparent bg-transparent text-destructive",
  info: "border-transparent bg-transparent text-info",
} satisfies Record<(typeof badgeIntents)[number], string>;

const dashedVariants = {
  primary: "border-dashed border-primary bg-primary-soft text-primary-soft-foreground",
  secondary: "border-dashed border-secondary bg-secondary-soft text-secondary-soft-foreground",
  tertiary: "border-dashed border-tertiary bg-tertiary-soft text-tertiary-soft-foreground",
  quaternary: "border-dashed border-quaternary bg-quaternary-soft text-quaternary-soft-foreground",
  neutral: "border-dashed border-neutral bg-neutral-soft text-neutral-soft-foreground",
  success: "border-dashed border-success bg-success-soft text-success-soft-foreground",
  warning: "border-dashed border-warning bg-warning-soft text-warning-soft-foreground",
  destructive: "border-dashed border-destructive bg-destructive-soft text-destructive-soft-foreground",
  info: "border-dashed border-info bg-info-soft text-info-soft-foreground",
} satisfies Record<(typeof badgeIntents)[number], string>;

const compoundVariants = badgeIntents.flatMap((intent) => [
  { intent, appearance: "solid" as const, className: solidVariants[intent] },
  { intent, appearance: "soft" as const, className: softVariants[intent] },
  { intent, appearance: "outline" as const, className: outlineVariants[intent] },
  { intent, appearance: "ghost" as const, className: ghostVariants[intent] },
  {
    intent,
    appearance: "link" as const,
    className: `border-transparent bg-transparent ${ghostVariants[intent]} underline-offset-4 hover:underline`,
  },
  { intent, appearance: "dashed" as const, className: dashedVariants[intent] },
]);

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full border body-callout-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      intent: Object.fromEntries(badgeIntents.map((intent) => [intent, ""])),
      appearance: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
        link: "",
        dashed: "",
      },
      variant: {
        default: solidVariants.primary,
        primary: solidVariants.primary,
        secondary: solidVariants.secondary,
        tertiary: solidVariants.tertiary,
        quaternary: solidVariants.quaternary,
        neutral: solidVariants.neutral,
        destructive: solidVariants.destructive,
        warning: solidVariants.warning,
        success: solidVariants.success,
        info: solidVariants.info,
        muted: "border-transparent bg-muted-surface text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
        outlinePrimary: outlineVariants.primary,
        outlineDestructive: outlineVariants.destructive,
        outlineWarning: outlineVariants.warning,
        outlineSuccess: outlineVariants.success,
        outlineInfo: outlineVariants.info,
        ghost: "border-transparent bg-transparent text-foreground",
        statusOpen: "border-transparent bg-success-soft text-success-soft-foreground",
        statusClosed: "border-transparent bg-muted-surface text-muted-foreground",
      },
      size: {
        xs: "h-5 px-1.5 body-caption",
        sm: "h-6 px-2 body-caption-medium",
        md: "h-6 px-2.5 body-callout-medium",
        lg: "h-7 px-3 body-callout-medium",
        xl: "h-8 px-3.5 body-paragraph-medium",
      },
      shiny: {
        true: "relative overflow-hidden",
        false: "",
      },
    },
    compoundVariants,
    defaultVariants: {
      intent: "primary",
      appearance: "solid",
      size: "md",
      shiny: false,
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  shiny?: boolean;
  shinySpeed?: number;
  interactive?: boolean;
}

function Badge({
  className,
  variant,
  intent,
  appearance,
  size,
  shiny = false,
  shinySpeed = 5,
  interactive = false,
  children,
  ...props
}: BadgeProps) {
  const animationDuration = `${shinySpeed}s`;
  const Comp = interactive ? motion.div : "div";

  const motionProps = interactive
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }
    : {};

  return (
    <Comp
      className={cn(badgeVariants({ variant, intent, appearance, size, shiny }), className)}
      {...motionProps}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      <span className={cn("inline-flex items-center justify-center gap-2", shiny && "relative z-10")}>{children}</span>

      {shiny && (
        <span
          className="absolute inset-0 pointer-events-none animate-shine dark:hidden"
          style={{
            background: "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animationDuration,
            mixBlendMode: "screen",
          }}
        />
      )}

      {shiny && (
        <span
          className="absolute inset-0 pointer-events-none animate-shine hidden dark:block"
          style={{
            background: "linear-gradient(120deg, transparent 40%, rgba(0,0,150,0.25) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animationDuration,
            mixBlendMode: "multiply",
          }}
        />
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
