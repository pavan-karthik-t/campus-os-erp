"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { logAudit } from "@/lib/audit/logger";
import { demoStudents } from "@/lib/demo-data";
import { z } from "zod";

const studentSchema = z.object({
  enrollment_number: z.string().min(1),
  department: z.string().min(1),
  semester: z.coerce.number().min(1).max(8),
  batch_year: z.coerce.number(),
  full_name: z.string().min(1),
  email: z.string().email(),
});

export async function getStudents(filters?: { department?: string; search?: string }) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "students:read")) throw new Error("Forbidden");

  return demoStudents
    .filter((student) => !filters?.department || student.department === filters.department)
    .filter((student) => {
      const search = filters?.search?.toLowerCase();
      if (!search) return true;
      return (
        student.enrollment_number.toLowerCase().includes(search) ||
        student.users.full_name.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => a.enrollment_number.localeCompare(b.enrollment_number));
}

export async function createStudent(formData: FormData) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "students:write")) return { error: "Forbidden" };

  const parsed = studentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await logAudit({ userId: profile.id, action: "create", resource: "students", metadata: parsed.data });
  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function deleteStudent(id: string) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "students:delete")) return { error: "Forbidden" };

  await logAudit({ userId: profile.id, action: "delete", resource: "students", resourceId: id });
  revalidatePath("/dashboard/students");
  return { success: true };
}
