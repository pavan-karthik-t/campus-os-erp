"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { logAudit } from "@/lib/audit/logger";
import { demoAttendance } from "@/lib/demo-data";

export async function getAttendance(filters?: { studentId?: string; date?: string }) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "attendance:read")) throw new Error("Forbidden");

  return demoAttendance
    .filter((record) => !filters?.studentId || record.student_id === filters.studentId)
    .filter((record) => !filters?.date || record.date === filters.date)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function markAttendance(records: {
  student_id: string;
  subject_id: string;
  date: string;
  status: string;
}[]) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "attendance:write")) return { error: "Forbidden" };

  await logAudit({ userId: profile.id, action: "create", resource: "attendance", metadata: { count: records.length } });
  revalidatePath("/dashboard/attendance");
  return { success: true };
}
