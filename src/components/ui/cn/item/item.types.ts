import type React from "react";

export type ItemVariant = "default" | "outline" | "muted";
export type ItemSize = "default" | "sm" | "xs";
export type ItemMediaVariant = "default" | "icon" | "image";

export type ItemGroupProps = React.HTMLAttributes<HTMLDivElement>;

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ItemVariant;
  size?: ItemSize;
}

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ItemMediaVariant;
}

export type ItemContentProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemTitleProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export type ItemActionsProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemFooterProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemSeparatorProps = React.HTMLAttributes<HTMLDivElement>;
