"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Bell, BookOpen, Calendar, CreditCard, GraduationCap, Search, Users, BarChart3, Shield,
} from "lucide-react";

const ICONS = {
  bell: Bell,
  book: BookOpen,
  calendar: Calendar,
  creditCard: CreditCard,
  graduationCap: GraduationCap,
  search: Search,
  users: Users,
  chart: BarChart3,
  shield: Shield,
};

const CARD_GRADIENTS = [
  { icon: "gradient-brand", bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
  { icon: "gradient-faculty", bg: "rgba(14,165,233,0.1)", color: "#0ea5e9" },
  { icon: "gradient-student", bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  { icon: "gradient-admin", bg: "rgba(139,92,246,0.1)", color: "#8b5cf6" },
  { icon: "gradient-warning", bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  { icon: "bg-[rgba(239,68,68,0.8)]", bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
];

export type StatCardIcon = keyof typeof ICONS;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: StatCardIcon;
  trend?: string;
  trendDir?: "up" | "down" | "neutral";
  delay?: number;
  colorIndex?: number;
  subtitle?: string;
}

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = Date.now();
      const step = () => {
        const progress = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(ease * target));
        if (progress < 1) requestAnimationFrame(step);
        else setCount(target);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendDir = "up",
  delay = 0,
  colorIndex = 0,
  subtitle,
}: StatCardProps) {
  const Icon = ICONS[icon];
  const palette = CARD_GRADIENTS[colorIndex % CARD_GRADIENTS.length];
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isNumeric = !isNaN(numericValue);
  const displayCount = useCountUp(isNumeric ? numericValue : 0, 1000, delay);
  const displayValue = isNumeric
    ? String(value).includes("%")
      ? `${displayCount}%`
      : String(value).includes("₹") || String(value).includes("$")
      ? String(value).replace(/\d+/, String(displayCount))
      : displayCount
    : value;

  const TrendIcon =
    trendDir === "up" ? TrendingUp : trendDir === "down" ? TrendingDown : Minus;
  const trendColor =
    trendDir === "up" ? "text-[#10b981]" : trendDir === "down" ? "text-[#ef4444]" : "text-[var(--muted)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="glass rounded-2xl border border-[var(--border)] p-5 shadow-neu hover:shadow-glow-brand hover:-translate-y-0.5 transition-all duration-200 cursor-default"
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn("flex h-11 w-11 items-center justify-center rounded-xl", palette.icon)}
            style={{ boxShadow: `0 4px 12px ${palette.color}30` }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-semibold", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {trend}
            </div>
          )}
        </div>

        <p className="text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
          {displayValue}
        </p>
        <p className="text-sm font-medium text-[var(--muted)] mt-1">{title}</p>
        {subtitle && <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
