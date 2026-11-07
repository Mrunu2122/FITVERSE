import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/constants";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "ice" | "silver" | "charcoal";
  pulse?: boolean;
}

export function StatusBadge({
  children,
  variant = "ice",
  pulse = false,
  className,
  ...props
}: StatusBadgeProps) {
  const variantStyles = {
    ice: "border-ice/30 bg-ice/10 text-ice",
    silver: "border-silver/25 bg-charcoal-light text-silver-bright",
    charcoal: "border-charcoal-border bg-charcoal text-silver-muted",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest",
        variantStyles,
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ice opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ice" />
        </span>
      )}
      {children}
    </span>
  );
}
