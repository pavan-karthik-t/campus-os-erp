"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Calendar, BookOpen, Clock,
  Bell, CreditCard, Search, Shield, GraduationCap,
  LogOut, ChevronLeft, ChevronRight,
  BarChart3, X, Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Avatar } from "@/components/ui/avatar";
import type { UserRole } from "@/types";

// ─── Nav Config ───────────────────────────────────────────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: Record<UserRole, NavSection[]> = {
  administrator: [
    {
      title: "Overview",
      items: [
        { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Academic",
      items: [
        { href: "/dashboard/students", label: "Students", icon: Users },
        { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
        { href: "/dashboard/marks", label: "Marks", icon: BookOpen },
        { href: "/dashboard/timetable", label: "Timetable", icon: Clock },
      ],
    },
    {
      title: "Management",
      items: [
        { href: "/dashboard/notices", label: "Notices", icon: Bell },
        { href: "/dashboard/fees", label: "Fees", icon: CreditCard },
        { href: "/dashboard/reclaim", label: "ReClaim", icon: Search },
      ],
    },
    {
      title: "System",
      items: [
        { href: "/dashboard/audit", label: "Audit Logs", icon: Shield },
      ],
    },
  ],
  faculty: [
    {
      title: "Overview",
      items: [
        { href: "/dashboard/faculty", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Academic",
      items: [
        { href: "/dashboard/students", label: "Students", icon: Users },
        { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
        { href: "/dashboard/marks", label: "Marks", icon: BookOpen },
        { href: "/dashboard/timetable", label: "Timetable", icon: Clock },
      ],
    },
    {
      title: "Communication",
      items: [
        { href: "/dashboard/notices", label: "Notices", icon: Bell },
      ],
    },
  ],
  student: [
    {
      title: "Overview",
      items: [
        { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Academic",
      items: [
        { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
        { href: "/dashboard/marks", label: "Results", icon: BarChart3 },
        { href: "/dashboard/timetable", label: "Timetable", icon: Clock },
      ],
    },
    {
      title: "Campus",
      items: [
        { href: "/dashboard/notices", label: "Notices", icon: Bell },
        { href: "/dashboard/fees", label: "Fees", icon: CreditCard },
        { href: "/dashboard/reclaim", label: "ReClaim", icon: Search },
      ],
    },
  ],
};

const ROLE_CONFIG: Record<UserRole, { label: string; gradient: string; glow: string; accent: string }> = {
  administrator: {
    label: "Administrator",
    gradient: "gradient-admin",
    glow: "sidebar-glow-admin",
    accent: "#8b5cf6",
  },
  faculty: {
    label: "Faculty",
    gradient: "gradient-faculty",
    glow: "sidebar-glow-faculty",
    accent: "#0ea5e9",
  },
  student: {
    label: "Student",
    gradient: "gradient-student",
    glow: "sidebar-glow-student",
    accent: "#10b981",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────
interface SidebarProps {
  role: UserRole;
  userName: string;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ─── Sidebar Component ────────────────────────────────────────────────────
export function Sidebar({ role, userName, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const sections = NAV_SECTIONS[role];
  const roleConfig = ROLE_CONFIG[role];

  const sidebarWidth = collapsed ? 72 : 260;

  const content = (
    <motion.aside
      layout
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden",
        "border-r border-[var(--sidebar-border)]",
        roleConfig.glow,
      )}
      style={{ background: "var(--sidebar-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--sidebar-border)] shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-neu", roleConfig.gradient)}>
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">CampusOS</p>
                <p className="text-[10px] font-medium" style={{ color: roleConfig.accent }}>
                  {roleConfig.label}
                </p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn("flex h-9 w-9 items-center justify-center rounded-xl shadow-neu mx-auto", roleConfig.gradient)}
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={toggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)] transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-2">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] select-none"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>

            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: collapsed ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl mx-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer group",
                      active
                        ? "text-white"
                        : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
                      collapsed && "justify-center px-0 mx-2"
                    )}
                  >
                    {/* Active background */}
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className={cn("absolute inset-0 rounded-xl", roleConfig.gradient)}
                        style={{ boxShadow: `0 4px 14px ${roleConfig.accent}40` }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <item.icon className={cn("relative z-10 h-4 w-4 shrink-0", active && "text-white")} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: User + Controls */}
      <div className="border-t border-[var(--sidebar-border)] p-3 space-y-1 shrink-0">
        {/* Expand toggle (when collapsed) */}
        {collapsed && (
          <button
            onClick={toggle}
            className="flex w-full items-center justify-center h-9 rounded-xl text-[var(--muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)] transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)] transition-colors",
            collapsed && "justify-center px-0"
          )}
          title="Logout"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User info */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--muted-bg)]"
            >
              <Avatar role={role} fallback={userName} size="sm" showRing />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[var(--foreground)] truncate">{userName}</p>
                <p className="text-[10px] text-[var(--muted)] capitalize">{role}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credits */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="mx-2 mt-1"
            >
              {/* Gradient divider */}
              <div
                className="h-px w-full mb-2 rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)" }}
              />
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Code2 className="h-3.5 w-3.5 shrink-0 opacity-50" style={{ color: "var(--brand)" }} />
                <div className="overflow-hidden">
                  <p className="text-[9px] font-medium uppercase tracking-widest text-[var(--muted)] opacity-60 mb-0.5">
                    Designed &amp; Developed by
                  </p>
                  <p
                    className="text-sm font-extrabold leading-none tracking-tight"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Kasindula Chaitanya
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">{content}</div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-40 h-full w-[260px] md:hidden"
            >
              {/* Close button */}
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--sidebar-hover)]"
              >
                <X className="h-4 w-4" />
              </button>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
