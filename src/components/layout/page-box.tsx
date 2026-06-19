"use client";
import React from "react";
import PageContainer from "@/components/layout/page-container";
import { SquareTitleIcon } from "@/components/ui/title-icon";
import Header from "./header";

type TitleIcon = {
  icon?: React.ElementType;
  variant?: "default" | "warning" | "info" | "destructive";
};

type LayoutPageContainerPropsBase = {
  breadcrumbs: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
};

export type LayoutPageContainerProps =
  | (LayoutPageContainerPropsBase & { ignoreIcon: true; titleIcon?: TitleIcon })
  | (LayoutPageContainerPropsBase & {
      ignoreIcon?: false | undefined;
      titleIcon?: { icon: React.ElementType; variant?: TitleIcon["variant"] };
    });

export const PageBoxLayout: React.FC<LayoutPageContainerProps> = ({
  breadcrumbs,
  titleIcon,
  title,
  actions,
  children,
  description,
  ignoreIcon,
}) => {
  const showHeader = Boolean(actions || title || description || (!ignoreIcon && titleIcon));
  const showLeft = Boolean(!ignoreIcon && (titleIcon || title || description));

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <PageContainer scrolllable>
        <div className="flex flex-col w-full gap-5 min-h-[calc(100vh-260px)] mb-20">
          {showHeader && (
            <div className="flex gap-4 flex-wrap items-center justify-between ">
              {showLeft && (
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-5 items-start lg:items-center">
                  {titleIcon && !ignoreIcon && titleIcon.icon && (
                    <SquareTitleIcon icon={titleIcon.icon} variant={titleIcon.variant} />
                  )}

                  {(title || description) && (
                    <div className="flex flex-col">
                      {title && <h2 className="heading-03-bold flex gap-2">{title}</h2>}
                      {description && (
                        <span className="body-paragraph-medium text-muted-foreground">{description}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {actions}
            </div>
          )}

          {children}
        </div>
      </PageContainer>
    </>
  );
};
