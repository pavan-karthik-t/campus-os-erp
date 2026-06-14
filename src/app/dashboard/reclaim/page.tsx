import React from "react";
import { getReclaimItems } from "@/actions/reclaim";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, MapPin, CalendarDays, Package, Smartphone, Key, CreditCard, BookOpen, ShoppingBag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ReclaimItem } from "@/types";

const CATEGORY_ICON: Record<string, React.ElementType> = {
  Phone: Smartphone,
  "ID Card": CreditCard,
  Keys: Key,
  Book: BookOpen,
  Bag: ShoppingBag,
};

const STATUS_COLUMNS = [
  { key: "found", label: "Found", color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
  { key: "under_review", label: "Under Review", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { key: "approved", label: "Approved", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  { key: "returned", label: "Returned", color: "#71717a", bg: "rgba(113,113,122,0.08)" },
] as const;

const BADGE_VARIANT: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  found: "default",
  under_review: "warning",
  approved: "success",
  returned: "secondary",
  rejected: "destructive",
};

export default async function ReclaimPage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "reclaim:read")) redirect("/dashboard");

  let items: ReclaimItem[] = [];
  try {
    items = (await getReclaimItems()) as ReclaimItem[];
  } catch {
    items = [];
  }

  const grouped = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.key] = items.filter((i) => i.status === col.key);
    return acc;
  }, {} as Record<string, ReclaimItem[]>);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">ReClaim</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Verified Lost &amp; Found system · {items.length} active cases</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-4 h-10 text-sm font-medium shadow-glow-brand hover:opacity-90 transition-all">
          <Package className="h-4 w-4" />
          Report Found Item
        </button>
      </div>

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
          <p className="text-sm text-[var(--muted)]">No items in ReClaim yet</p>
        </Card>
      ) : (
        /* Kanban board */
        <div className="flex gap-4 overflow-x-auto pb-2">
          {STATUS_COLUMNS.map((col) => {
            const colItems = grouped[col.key] ?? [];
            return (
              <div key={col.key} className="kanban-col flex flex-col gap-3">
                {/* Column header */}
                <div
                  className="flex items-center justify-between rounded-xl px-4 py-2.5"
                  style={{ background: col.bg }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
                    <p className="text-sm font-semibold" style={{ color: col.color }}>{col.label}</p>
                  </div>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: col.color }}
                  >
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                {colItems.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-8 text-center"
                    style={{ borderColor: `${col.color}30` }}
                  >
                    <p className="text-xs text-[var(--muted)]">No items</p>
                  </div>
                ) : (
                  colItems.map((item) => {
                    const Icon = CATEGORY_ICON[item.category] ?? Package;
                    return (
                      <div
                        key={item.id}
                        className="glass rounded-2xl border border-[var(--border)] p-4 hover:-translate-y-0.5 hover:shadow-glow-brand transition-all duration-200 cursor-pointer"
                      >
                        {/* Category header */}
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: `${col.color}18` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: col.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--foreground)] truncate">{item.category}</p>
                            <Badge variant={BADGE_VARIANT[item.status] ?? "default"} dot className="text-[10px]">
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>

                        {/* Details */}
                        {item.description && (
                          <p className="text-xs text-[var(--muted)] mb-3 line-clamp-2">{item.description}</p>
                        )}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{item.location_found}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                            <CalendarDays className="h-3 w-3 shrink-0" />
                            <span>{formatDate(item.date_found)}</span>
                          </div>
                        </div>

                        {/* Claim button for students */}
                        {item.status === "found" && profile.role === "student" && (
                          <button
                            className="mt-3 w-full rounded-xl py-1.5 text-xs font-semibold transition-colors"
                            style={{
                              background: `${col.color}15`,
                              color: col.color,
                              border: `1px solid ${col.color}30`,
                            }}
                          >
                            Claim This Item
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
