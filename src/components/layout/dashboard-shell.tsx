"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { SidebarProvider, useSidebar } from "@/components/providers/sidebar-provider";
import { logoutAction } from "@/actions/auth";
import type { UserRole } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}

function ShellInner({ children, role, userName }: DashboardShellProps) {
  const { collapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
  };

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%), var(--background)",
      }}
    >
      <Sidebar
        role={role}
        userName={userName}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Topbar
        role={role}
        userName={userName}
        onMobileMenuOpen={() => setMobileOpen(true)}
      />

      <motion.main
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen pt-16 relative"
      >
        <div className="p-6 md:p-8 max-w-[1600px]">
          {children}
        </div>

        {/* ── Watermark Credit ─────────────────────────────────────────── */}
        <div
          className="pointer-events-none fixed bottom-6 right-8 z-20 select-none text-right"
          aria-hidden="true"
        >
          <p
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ color: "rgba(99,102,241,0.35)", letterSpacing: "0.2em" }}
          >
            Designed &amp; Developed by
          </p>
          <p
            className="text-2xl font-extrabold tracking-tight leading-none mt-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.16) 50%, rgba(236,72,153,0.12) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Kasindula Chaitanya
          </p>
        </div>
      </motion.main>
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <SidebarProvider>
      <ShellInner {...props} />
    </SidebarProvider>
  );
}
