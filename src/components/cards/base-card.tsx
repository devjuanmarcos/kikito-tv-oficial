import { JSX } from "react";

export interface BaseCardProps {
  children: JSX.Element;
  variant?: "default" | "dashboard" | "dashboard-mini";
  background?: "background" | "card";
  className?: string;
}

export const BaseCard = ({ children, variant = "default", background = "card", className }: BaseCardProps) => {
  let baseClass;
  let backgroundClass = `bg-${background}`;

  switch (variant) {
    case "dashboard":
      baseClass = `flex flex-col rounded-[.75rem] w-full gap-6 p-4 md:p-6 ${backgroundClass} border-[.0313rem] relative border`;
      break;

    case "dashboard-mini":
      baseClass = `flex flex-col rounded-[.75rem] w-full gap-6 p-4 md:p-5 ${backgroundClass} border-[.0313rem] relative border`;
      break;

    case "default":
      baseClass = `flex flex-col rounded-3xl w-full gap-6 p-4 md:p-6 ${backgroundClass} relative border`;
      break;
  }

  return <div className={`${baseClass} ${className}`}>{children}</div>;
};
