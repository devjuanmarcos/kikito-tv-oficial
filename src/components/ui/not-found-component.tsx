import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const notFoundVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    variant: {
      default: "py-12",
      large: "py-16 min-h-[400px]",
      compact: "py-8",
      fullPage: "min-h-screen",
    },
    color: {
      default: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      warning: "text-warning",
      info: "text-info",
    },
  },
  defaultVariants: {
    variant: "default",
    color: "default",
  },
});

export interface NotFoundComponentProps extends VariantProps<typeof notFoundVariants> {
  emote: string;
  title: string;
  description: string;
  backButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
  };
  className?: string;
}

export const NotFoundComponent: React.FC<NotFoundComponentProps> = ({
  emote,
  title,
  description,
  backButton,
  variant,
  color,
  className,
}) => {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/50 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-secondary-50 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-tertiary-50 blur-3xl"></div>
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-col items-center justify-center px-4 py-16",
          notFoundVariants({ variant, color })
        )}
      >
        <div className="flex flex-col items-center text-center max-w-2xl">
          <div className="relative">
            <h1 className="text-[10rem] font-black text-primary opacity-20 leading-none select-none md:text-[15rem]">
              {emote}
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="heading-03-bold text-primary">{title}</h2>
            </div>
          </div>

          <p className="mt-8 body-paragraph text-muted-foreground max-w-md">{description}</p>

          <div className="my-12 relative w-48 h-48">
            <div className="absolute inset-0 bg-primary rounded-lg rotate-12 opacity-20"></div>
            <div className="absolute inset-4 bg-primary rounded-lg -rotate-12 opacity-40"></div>
            <div className="absolute inset-8 flex items-center justify-center">
              <span className="text-7xl">😐</span>
            </div>
          </div>

          {backButton && (
            <div className="space-x-4">
              <Button variant="default" size="lg" onClick={backButton.onClick} className="flex items-center gap-2">
                {backButton.icon && <backButton.icon className="h-4 w-4" />}
                {backButton.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
