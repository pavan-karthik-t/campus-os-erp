"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const ROLE_GRADIENT: Record<UserRole, string> = {
  administrator: "gradient-admin",
  faculty: "gradient-faculty",
  student: "gradient-student",
};

const ROLE_RING: Record<UserRole, string> = {
  administrator: "ring-[#8b5cf6]",
  faculty: "ring-[#0ea5e9]",
  student: "ring-[#10b981]",
};

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  role?: UserRole;
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showRing?: boolean;
}

const SIZE_MAP = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({
  role,
  src,
  fallback,
  size = "md",
  showRing = false,
  className,
  ...props
}: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        SIZE_MAP[size],
        showRing && role && `ring-2 ring-offset-2 ring-offset-[var(--surface)] ${ROLE_RING[role]}`,
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={fallback}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className={cn(
          "flex h-full w-full items-center justify-center font-semibold text-white",
          role ? ROLE_GRADIENT[role] : "gradient-brand"
        )}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { AvatarPrimitive };
