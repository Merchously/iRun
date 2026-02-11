import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "primary" | "muted" | "destructive" | "success";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          {
            "bg-foreground/10 text-foreground": variant === "default",
            "border border-border text-muted-foreground": variant === "outline",
            "bg-primary text-primary-foreground": variant === "primary",
            "bg-muted text-muted-foreground": variant === "muted",
            "bg-destructive text-destructive-foreground": variant === "destructive",
            "bg-success/10 text-success": variant === "success",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
