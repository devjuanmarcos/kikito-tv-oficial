import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertIntents = [
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
  primary: "bg-primary text-primary-foreground border-primary [&>svg]:text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground border-secondary [&>svg]:text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground border-tertiary [&>svg]:text-tertiary-foreground",
  quaternary: "bg-quaternary text-quaternary-foreground border-quaternary [&>svg]:text-quaternary-foreground",
  neutral: "bg-neutral text-neutral-foreground border-neutral [&>svg]:text-neutral-foreground",
  success: "bg-success text-success-foreground border-success [&>svg]:text-success-foreground",
  warning: "bg-warning text-warning-foreground border-warning [&>svg]:text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground border-destructive [&>svg]:text-destructive-foreground",
  info: "bg-info text-info-foreground border-info [&>svg]:text-info-foreground",
} satisfies Record<(typeof alertIntents)[number], string>;

const softVariants = {
  primary: "bg-primary-soft text-primary-soft-foreground border-primary-soft [&>svg]:text-primary",
  secondary: "bg-secondary-soft text-secondary-soft-foreground border-secondary-soft [&>svg]:text-secondary",
  tertiary: "bg-tertiary-soft text-tertiary-soft-foreground border-tertiary-soft [&>svg]:text-tertiary",
  quaternary: "bg-quaternary-soft text-quaternary-soft-foreground border-quaternary-soft [&>svg]:text-quaternary",
  neutral: "bg-neutral-soft text-neutral-soft-foreground border-neutral-soft [&>svg]:text-neutral",
  success: "bg-success-soft text-success-soft-foreground border-success-soft [&>svg]:text-success",
  warning: "bg-warning-soft text-warning-soft-foreground border-warning-soft [&>svg]:text-warning",
  destructive: "bg-destructive-soft text-destructive-soft-foreground border-destructive-soft [&>svg]:text-destructive",
  info: "bg-info-soft text-info-soft-foreground border-info-soft [&>svg]:text-info",
} satisfies Record<(typeof alertIntents)[number], string>;

const outlineVariants = {
  primary: "bg-card text-foreground border-primary [&>svg]:text-primary",
  secondary: "bg-card text-foreground border-secondary [&>svg]:text-secondary",
  tertiary: "bg-card text-foreground border-tertiary [&>svg]:text-tertiary",
  quaternary: "bg-card text-foreground border-quaternary [&>svg]:text-quaternary",
  neutral: "bg-card text-foreground border-neutral [&>svg]:text-neutral",
  success: "bg-card text-foreground border-success [&>svg]:text-success",
  warning: "bg-card text-foreground border-warning [&>svg]:text-warning",
  destructive: "bg-card text-foreground border-destructive [&>svg]:text-destructive",
  info: "bg-card text-foreground border-info [&>svg]:text-info",
} satisfies Record<(typeof alertIntents)[number], string>;

const ghostVariants = {
  primary: "bg-transparent text-primary border-transparent [&>svg]:text-primary",
  secondary: "bg-transparent text-secondary border-transparent [&>svg]:text-secondary",
  tertiary: "bg-transparent text-tertiary border-transparent [&>svg]:text-tertiary",
  quaternary: "bg-transparent text-quaternary border-transparent [&>svg]:text-quaternary",
  neutral: "bg-transparent text-neutral border-transparent [&>svg]:text-neutral",
  success: "bg-transparent text-success border-transparent [&>svg]:text-success",
  warning: "bg-transparent text-warning border-transparent [&>svg]:text-warning",
  destructive: "bg-transparent text-destructive border-transparent [&>svg]:text-destructive",
  info: "bg-transparent text-info border-transparent [&>svg]:text-info",
} satisfies Record<(typeof alertIntents)[number], string>;

const dashedVariants = {
  primary: "border-dashed bg-primary-soft text-primary-soft-foreground border-primary [&>svg]:text-primary",
  secondary: "border-dashed bg-secondary-soft text-secondary-soft-foreground border-secondary [&>svg]:text-secondary",
  tertiary: "border-dashed bg-tertiary-soft text-tertiary-soft-foreground border-tertiary [&>svg]:text-tertiary",
  quaternary:
    "border-dashed bg-quaternary-soft text-quaternary-soft-foreground border-quaternary [&>svg]:text-quaternary",
  neutral: "border-dashed bg-neutral-soft text-neutral-soft-foreground border-neutral [&>svg]:text-neutral",
  success: "border-dashed bg-success-soft text-success-soft-foreground border-success [&>svg]:text-success",
  warning: "border-dashed bg-warning-soft text-warning-soft-foreground border-warning [&>svg]:text-warning",
  destructive:
    "border-dashed bg-destructive-soft text-destructive-soft-foreground border-destructive [&>svg]:text-destructive",
  info: "border-dashed bg-info-soft text-info-soft-foreground border-info [&>svg]:text-info",
} satisfies Record<(typeof alertIntents)[number], string>;

const compoundVariants = alertIntents.flatMap((intent) => [
  { intent, appearance: "solid" as const, className: solidVariants[intent] },
  { intent, appearance: "soft" as const, className: softVariants[intent] },
  { intent, appearance: "outline" as const, className: outlineVariants[intent] },
  { intent, appearance: "ghost" as const, className: ghostVariants[intent] },
  { intent, appearance: "link" as const, className: ghostVariants[intent] },
  { intent, appearance: "dashed" as const, className: dashedVariants[intent] },
]);

const alertVariants = cva(
  "relative w-full rounded-lg border [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      intent: Object.fromEntries(alertIntents.map((intent) => [intent, ""])),
      appearance: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
        link: "",
        dashed: "",
      },
      variant: {
        default: "bg-card text-foreground border-border [&>svg]:text-foreground",
        primary: softVariants.primary,
        secondary: softVariants.secondary,
        tertiary: softVariants.tertiary,
        quaternary: softVariants.quaternary,
        neutral: softVariants.neutral,
        destructive: softVariants.destructive,
        warning: softVariants.warning,
        success: softVariants.success,
        info: softVariants.info,
        outlineDestructive: outlineVariants.destructive,
        outlineWarning: outlineVariants.warning,
        outlineSuccess: outlineVariants.success,
        outlineInfo: outlineVariants.info,
        outlinePrimary: outlineVariants.primary,
      },
      size: {
        xs: "p-3 body-caption",
        sm: "p-3.5 body-callout",
        md: "p-4 body-paragraph",
        lg: "p-5 body-paragraph",
        xl: "p-6 body-title",
      },
    },
    compoundVariants,
    defaultVariants: {
      intent: "neutral",
      appearance: "soft",
      size: "md",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, intent, appearance, size, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, intent, appearance, size }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    return <h5 ref={ref} className={cn("mb-1 body-title-bold leading-none tracking-tight", className)} {...props} />;
  }
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("body-paragraph [&_p]:leading-relaxed", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
