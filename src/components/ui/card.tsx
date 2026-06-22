import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, interactive = false, ...props }, ref) => {
  if (interactive) {
    return (
      <motion.div
        ref={ref}
        className={cn("rounded-xl border border-border text-card-foreground shadow bg-card ", className)}
        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
      />
    );
  }
  return (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border text-card-foreground shadow bg-card ", className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    return <h3 ref={ref} className={cn("body-title-bold leading-none tracking-tight", className)} {...props} />;
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("body-paragraph text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-2 md:p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center body-paragraph text-muted-foreground p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
