"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full border placeholder:text-muted-foreground placeholder:opacity-50 text-body-callout rounded-md body-paragraph focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 block px-3 h-[2.375rem] bg-background transition-colors disabled:cursor-not-allowed disabled:opacity-50 autofill:bg-background",
  {
    variants: {
      variant: {
        default: "border-border focus-visible:ring-ring",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
        warning: "border-warning focus-visible:ring-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  ignoreFontSize?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ignoreFontSize, type, variant, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <input
          type={isPasswordVisible ? "text" : type}
          className={cn(
            inputVariants({ variant }),
            ignoreFontSize && "text-[unset]",
            type === "password" && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          >
            <div className="relative w-5 h-5">
              <EyeOffIcon
                className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-200",
                  isPasswordVisible ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )}
              />
              <EyeIcon
                className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-200",
                  isPasswordVisible ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )}
              />
            </div>
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
