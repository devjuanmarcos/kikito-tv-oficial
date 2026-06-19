import React from "react";
import { Badge, badgeVariants } from "./ui/badge";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type CategoryBadgeBaseProps = {
  title: string;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  shiny?: boolean;
  shinySpeed?: number;
  className?: string;
};

export type CategoryBadgeProps =
  | (CategoryBadgeBaseProps & {
      useIcon: true;
      icon: React.ElementType;
      color?: never;
    })
  | (CategoryBadgeBaseProps & {
      useIcon?: false;
      icon?: never;
      color: string;
    });

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  title,
  variant = "outline",
  shiny,
  shinySpeed,
  className,
  useIcon,
  icon: Icon,
  color,
}) => {
  return (
    <Badge
      variant={variant}
      shiny={shiny}
      shinySpeed={shinySpeed}
      className={cn("flex gap-2 items-center w-fit", className)}
    >
      {useIcon && Icon ? (
        <Icon className="size-4" />
      ) : (
        <span className="relative flex size-4">
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", color)} />
          <span className={cn("relative inline-flex size-4 rounded-full", color)} />
        </span>
      )}
      {title}
    </Badge>
  );
};
