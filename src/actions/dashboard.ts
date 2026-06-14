"use server";

import { requireAuth } from "@/lib/auth/session";
import { demoAttendance, demoFees, demoNotices, demoReclaimItems, demoStudents, demoAuditLogs } from "@/lib/demo-data";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAuth();
  const totalAttendance = demoAttendance.length;
  const presentCount = demoAttendance.filter((a) => a.status === "present").length;
  const feeCollection = demoFees.reduce((sum, f) => sum + Number(f.paid_amount), 0);

  return {
    totalStudents: demoStudents.length,
    totalFaculty: 8,
    attendanceRate: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
    feeCollection,
    activeNotices: demoNotices.filter((notice) => notice.status === "published").length,
    reclaimCases: demoReclaimItems.filter((item) => item.status !== "returned").length,
  };
}

export async function getAttendanceTrend() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    rate: 75 + Math.round(Math.random() * 20),
  }));
}

export async function getReclaimStats() {
  const counts: Record<string, number> = {};
  demoReclaimItems.forEach((item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export async function getAuditLogs({ limit }: { limit?: number } = {}) {
  await requireAuth();
  const logs = [...demoAuditLogs].sort(
    (a, b) => b.created_at.localeCompare(a.created_at)
  );
  return limit ? logs.slice(0, limit) : logs;
}
