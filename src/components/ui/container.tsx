import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/constants";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "default" | "wide" | "narrow";
}

export function Container({
  children,
  size = "default",
  className,
  ...props
}: ContainerProps) {
  const maxWidthClass =
    size === "wide"
      ? "max-w-[1440px]"
      : size === "narrow"
        ? "max-w-4xl"
        : "max-w-7xl";

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
