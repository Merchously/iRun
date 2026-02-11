"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface FilterPillProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const FilterPill = forwardRef<HTMLButtonElement, FilterPillProps>(
  ({ className, active = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
FilterPill.displayName = "FilterPill";

export { FilterPill };
