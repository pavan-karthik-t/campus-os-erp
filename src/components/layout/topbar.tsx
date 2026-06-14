"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

interface TopbarProps {
  role: UserRole;
  userName: string;
  onMobileMenuOpen: () => void;
}

function getBreadcrumb(pathname: string): string[] {
  const segments = pathname.replace("/dashboard/", "").split("/");
  return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

export function Topbar({ role, userName, onMobileMenuOpen }: TopbarProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const [notifOpen, setNotifOpen] = useState(false);
  const breadcrumbs = getBreadcrumb(pathname);

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <motion.header
      animate={{ paddingLeft: sidebarWidth + 24 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 z-30 flex h-16 items-center gap-4 pr-6 border-b border-[var(--border)] w-full"
      style={{ background: "var(--background)", backdropFilter: "blur(12px)" }}
    >
      {/* Mobile menu */}
      <button
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl hover:bg-[var(--muted-bg)] transition-colors"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-1">
        <span className="text-[var(--muted)]">Dashboard</span>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--muted)]" />
            <span
              className={cn(
                i === breadcrumbs.length - 1
                  ? "font-semibold text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              )}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search hint */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] px-3 h-9 text-sm text-[var(--muted)] cursor-pointer hover:border-[var(--brand)] transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-2 text-[10px] font-mono bg-[var(--border)] rounded px-1 py-0.5">Ctrl K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--danger)] border-2 border-[var(--background)]" />
          </Button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border border-[var(--border)] shadow-neu overflow-hidden"
                style={{ background: "var(--surface)" }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="text-xs text-[var(--brand)] cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-[var(--border)] max-h-72 overflow-y-auto">
                  {[
                    { title: "Internal assessment schedule published", time: "2 hours ago", unread: true },
                    { title: "Library extended hours during exam week", time: "1 day ago", unread: true },
                    { title: "New student enrolled: Kabir Shah", time: "3 days ago", unread: false },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-[var(--muted-bg)] transition-colors cursor-pointer",
                        n.unread && "bg-[rgba(99,102,241,0.04)]"
                      )}
                    >
                      {n.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                      )}
                      {!n.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0" />}
                      <div>
                        <p className="text-xs font-medium text-[var(--foreground)]">{n.title}</p>
                        <p className="text-[10px] text-[var(--muted)] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[var(--border)]">
                  <p className="text-xs text-center text-[var(--brand)] cursor-pointer hover:underline">View all notifications</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <Avatar role={role} fallback={userName} size="sm" showRing />
      </div>
    </motion.header>
  );
}
