"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const intents = [
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
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  tertiary: "bg-tertiary text-tertiary-foreground hover:bg-tertiary/90",
  quaternary: "bg-quaternary text-quaternary-foreground hover:bg-quaternary/90",
  neutral: "bg-neutral text-neutral-foreground hover:bg-neutral/90",
  success: "bg-success text-success-foreground hover:bg-success-hover",
  warning: "bg-warning text-warning-foreground hover:bg-warning-hover",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
  info: "bg-info text-info-foreground hover:bg-info-hover",
} satisfies Record<(typeof intents)[number], string>;

const softVariants = {
  primary: "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/80",
  secondary: "bg-secondary-soft text-secondary-soft-foreground hover:bg-secondary-soft/80",
  tertiary: "bg-tertiary-soft text-tertiary-soft-foreground hover:bg-tertiary-soft/80",
  quaternary: "bg-quaternary-soft text-quaternary-soft-foreground hover:bg-quaternary-soft/80",
  neutral: "bg-neutral-soft text-neutral-soft-foreground hover:bg-neutral-soft/80",
  success: "bg-success-soft text-success-soft-foreground hover:bg-success-soft/80",
  warning: "bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft/80",
  destructive: "bg-destructive-soft text-destructive-soft-foreground hover:bg-destructive-soft/80",
  info: "bg-info-soft text-info-soft-foreground hover:bg-info-soft/80",
} satisfies Record<(typeof intents)[number], string>;

const outlineVariants = {
  primary: "border border-primary bg-background text-primary hover:bg-primary-soft",
  secondary: "border border-secondary bg-background text-secondary hover:bg-secondary-soft",
  tertiary: "border border-tertiary bg-background text-tertiary hover:bg-tertiary-soft",
  quaternary: "border border-quaternary bg-background text-quaternary hover:bg-quaternary-soft",
  neutral: "border border-neutral bg-background text-neutral hover:bg-neutral-soft",
  success: "border border-success bg-background text-success hover:bg-success-soft",
  warning: "border border-warning bg-background text-warning hover:bg-warning-soft",
  destructive: "border border-destructive bg-background text-destructive hover:bg-destructive-soft",
  info: "border border-info bg-background text-info hover:bg-info-soft",
} satisfies Record<(typeof intents)[number], string>;

const ghostVariants = {
  primary: "bg-transparent text-primary hover:bg-primary-soft",
  secondary: "bg-transparent text-secondary hover:bg-secondary-soft",
  tertiary: "bg-transparent text-tertiary hover:bg-tertiary-soft",
  quaternary: "bg-transparent text-quaternary hover:bg-quaternary-soft",
  neutral: "bg-transparent text-neutral hover:bg-neutral-soft",
  success: "bg-transparent text-success hover:bg-success-soft",
  warning: "bg-transparent text-warning hover:bg-warning-soft",
  destructive: "bg-transparent text-destructive hover:bg-destructive-soft",
  info: "bg-transparent text-info hover:bg-info-soft",
} satisfies Record<(typeof intents)[number], string>;

const linkVariants = {
  primary: "text-primary hover:text-primary-hover",
  secondary: "text-secondary hover:text-secondary/80",
  tertiary: "text-tertiary hover:text-tertiary/80",
  quaternary: "text-quaternary hover:text-quaternary/80",
  neutral: "text-neutral hover:text-neutral/80",
  success: "text-success hover:text-success-hover",
  warning: "text-warning hover:text-warning-hover",
  destructive: "text-destructive hover:text-destructive-hover",
  info: "text-info hover:text-info-hover",
} satisfies Record<(typeof intents)[number], string>;

const dashedVariants = {
  primary: "border border-dashed border-primary bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/80",
  secondary:
    "border border-dashed border-secondary bg-secondary-soft text-secondary-soft-foreground hover:bg-secondary-soft/80",
  tertiary:
    "border border-dashed border-tertiary bg-tertiary-soft text-tertiary-soft-foreground hover:bg-tertiary-soft/80",
  quaternary:
    "border border-dashed border-quaternary bg-quaternary-soft text-quaternary-soft-foreground hover:bg-quaternary-soft/80",
  neutral: "border border-dashed border-neutral bg-neutral-soft text-neutral-soft-foreground hover:bg-neutral-soft/80",
  success: "border border-dashed border-success bg-success-soft text-success-soft-foreground hover:bg-success-soft/80",
  warning: "border border-dashed border-warning bg-warning-soft text-warning-soft-foreground hover:bg-warning-soft/80",
  destructive:
    "border border-dashed border-destructive bg-destructive-soft text-destructive-soft-foreground hover:bg-destructive-soft/80",
  info: "border border-dashed border-info bg-info-soft text-info-soft-foreground hover:bg-info-soft/80",
} satisfies Record<(typeof intents)[number], string>;

const compoundVariants = intents.flatMap((intent) => [
  { intent, appearance: "solid" as const, className: solidVariants[intent] },
  { intent, appearance: "soft" as const, className: softVariants[intent] },
  { intent, appearance: "outline" as const, className: outlineVariants[intent] },
  { intent, appearance: "ghost" as const, className: ghostVariants[intent] },
  { intent, appearance: "link" as const, className: linkVariants[intent] },
  { intent, appearance: "dashed" as const, className: dashedVariants[intent] },
]);

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md body-callout-medium leading-none ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 whitespace-nowrap cursor-pointer",
  {
    variants: {
      intent: Object.fromEntries(intents.map((intent) => [intent, ""])),
      appearance: {
        solid: "",
        soft: "",
        outline: "",
        ghost: "",
        link: "h-auto px-0 py-0 underline-offset-4 hover:underline",
        dashed: "",
      },
      variant: {
        default: solidVariants.primary,
        primary: solidVariants.primary,
        secondary: solidVariants.secondary,
        tertiary: solidVariants.tertiary,
        quaternary: solidVariants.quaternary,
        neutral: solidVariants.neutral,
        success: solidVariants.success,
        warning: solidVariants.warning,
        destructive: solidVariants.destructive,
        info: solidVariants.info,
        card: "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground",
        outline: "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        outlinePrimary: outlineVariants.primary,
        outlineDestructive: outlineVariants.destructive,
        outlineWarning: outlineVariants.warning,
        outlineSuccess: outlineVariants.success,
        outlineInfo: outlineVariants.info,
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghostPrimary: ghostVariants.primary,
        link: "bg-transparent text-primary-hover underline-offset-4 hover:text-primary hover:underline p-0",
      },
      size: {
        xs: "h-7 px-2.5 text-[0.75rem] [&_svg]:size-3.5",
        sm: "h-8 px-3 body-caption-medium [&_svg]:size-3.5",
        md: "h-10 px-4 body-callout-medium [&_svg]:size-4",
        lg: "h-11 px-5 body-paragraph-medium [&_svg]:size-4",
        xl: "h-12 px-6 body-paragraph-medium [&_svg]:size-5",
        default: "h-10 px-4 body-callout-medium [&_svg]:size-4",
        icon: "h-10 w-10 [&_svg]:size-4",
        link: "w-fit",
      },
    },
    compoundVariants,
    defaultVariants: {
      intent: "primary",
      appearance: "solid",
      size: "default",
    },
  }
);

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ElementType;
  href: string;
  hoverScale?: number;
  tapScale?: number;
  disableAnimation?: boolean;
}

const MotionLink = motion.create(Link);

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      className,
      variant,
      intent,
      appearance,
      size,
      asChild = false,
      loading = false,
      loadingText,
      children,
      icon: Icon,
      href,
      hoverScale = 1.05,
      tapScale = 0.95,
      disableAnimation = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, intent, appearance, size, className }))}
          ref={ref}
          href={href}
          aria-disabled={loading || props["aria-disabled"]}
          tabIndex={loading ? -1 : props.tabIndex}
          {...props}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>{loadingText || "Carregando..."}</span>
            </>
          ) : (
            <>
              {Icon && <Icon />}
              {children}
            </>
          )}
        </Slot>
      );
    }

    const motionProps = disableAnimation
      ? {}
      : {
          whileHover: { scale: hoverScale },
          whileTap: { scale: tapScale },
          transition: { type: "spring", stiffness: 400, damping: 17 },
        };

    return (
      <MotionLink
        className={cn(buttonVariants({ variant, intent, appearance, size, className }))}
        ref={ref}
        href={href}
        aria-disabled={loading || props["aria-disabled"]}
        tabIndex={loading ? -1 : props.tabIndex}
        {...motionProps}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>{loadingText || "Carregando..."}</span>
          </>
        ) : (
          <>
            {Icon && <Icon />}
            {children}
          </>
        )}
      </MotionLink>
    );
  }
);
LinkButton.displayName = "LinkButton";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ElementType;
  hoverScale?: number;
  tapScale?: number;
  disableAnimation?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      intent,
      appearance,
      size,
      asChild = false,
      loading = false,
      loadingText,
      icon: Icon,
      children,
      hoverScale = 1.05,
      tapScale = 0.95,
      disableAnimation = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, intent, appearance, size, className }))}
          ref={ref}
          {...props}
          disabled={loading || props.disabled}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>{loadingText || "Carregando..."}</span>
            </>
          ) : (
            <>
              {Icon && <Icon />}
              {children}
            </>
          )}
        </Slot>
      );
    }

    const motionProps = disableAnimation
      ? {}
      : {
          whileHover: { scale: hoverScale },
          whileTap: { scale: tapScale },
          transition: { type: "spring", stiffness: 400, damping: 17 },
        };

    return (
      <motion.button
        className={cn(buttonVariants({ variant, intent, appearance, size, className }))}
        ref={ref}
        {...motionProps}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        disabled={loading || props.disabled}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>{loadingText || "Carregando..."}</span>
          </>
        ) : (
          <>
            {Icon && <Icon />}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, LinkButton, buttonVariants };
