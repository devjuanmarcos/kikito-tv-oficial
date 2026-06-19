import { Search } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

export interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input ref={ref} className={cn("pl-9", className)} {...props} />
      </div>
    );
  }
);
InputSearch.displayName = "InputSearch";

export { InputSearch };
