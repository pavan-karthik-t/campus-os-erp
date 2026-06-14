"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { logAudit } from "@/lib/audit/logger";
import { demoMarks } from "@/lib/demo-data";

export async function getMarks(filters?: { studentId?: string; semester?: number }) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "marks:read")) throw new Error("Forbidden");

  return demoMarks
    .filter((mark) => !filters?.studentId || mark.student_id === filters.studentId)
    .filter((mark) => !filters?.semester || mark.semester === filters.semester)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function upsertMarks(mark: {
  student_id: string;
  subject_id: string;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
  semester: number;
  academic_year: string;
}) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "marks:write")) return { error: "Forbidden" };

  await logAudit({ userId: profile.id, action: "update", resource: "marks", metadata: mark });
  revalidatePath("/dashboard/marks");
  return { success: true };
}
