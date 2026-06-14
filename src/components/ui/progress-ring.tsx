"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  className,
  color = "var(--brand)",
  label,
  sublabel,
  animate = true,
}: ProgressRingProps) {
  const [displayValue, setDisplayValue] = React.useState(animate ? 0 : value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  React.useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value, animate]);

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animate ? "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            filter: `drop-shadow(0 0 6px ${color === "var(--brand)" ? "rgba(99,102,241,0.5)" : color})`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && (
          <span className="font-bold" style={{ fontSize: size * 0.18, lineHeight: 1.1 }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[var(--muted)]" style={{ fontSize: size * 0.1 }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
