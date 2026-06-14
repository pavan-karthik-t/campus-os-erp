import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand)] text-white",
        secondary:
          "bg-[var(--muted-bg)] text-[var(--muted)] border border-[var(--border)]",
        success:
          "bg-[rgba(16,185,129,0.12)] text-[#10b981] border border-[rgba(16,185,129,0.25)]",
        warning:
          "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.25)]",
        destructive:
          "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.25)]",
        info:
          "bg-[rgba(59,130,246,0.12)] text-[#3b82f6] border border-[rgba(59,130,246,0.25)]",
        violet:
          "bg-[rgba(139,92,246,0.12)] text-[#8b5cf6] border border-[rgba(139,92,246,0.25)]",
        outline:
          "border border-[var(--border-strong)] text-[var(--foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-[#10b981]",
            variant === "warning" && "bg-[#f59e0b]",
            variant === "destructive" && "bg-[#ef4444]",
            variant === "info" && "bg-[#3b82f6]",
            variant === "violet" && "bg-[#8b5cf6]",
            !variant || variant === "default" || variant === "secondary" || variant === "outline"
              ? "bg-current"
              : ""
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
