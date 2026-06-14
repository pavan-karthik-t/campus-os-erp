"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { logAudit } from "@/lib/audit/logger";
import { demoNotices } from "@/lib/demo-data";

export async function getNotices(status?: string) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "notices:read")) throw new Error("Forbidden");

  return demoNotices
    .filter((notice) => !status || notice.status === status)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function createNotice(formData: FormData) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "notices:write")) return { error: "Forbidden" };

  const notice = {
    id: `notice-${Date.now()}`,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    author_id: profile.id,
    target_audience: ((formData.get("target_audience") as string) || "all") as "all",
    status: "draft",
  };

  await logAudit({ userId: profile.id, action: "create", resource: "notices", resourceId: notice.id });
  revalidatePath("/dashboard/notices");
  return { success: true, id: notice.id };
}

export async function publishNotice(id: string) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "notices:write")) return { error: "Forbidden" };

  await logAudit({ userId: profile.id, action: "notice_publish", resource: "notices", resourceId: id });
  revalidatePath("/dashboard/notices");
  return { success: true };
}

export async function archiveNotice(id: string) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "notices:write")) return { error: "Forbidden" };

  await logAudit({ userId: profile.id, action: "update", resource: "notices", resourceId: id });
  revalidatePath("/dashboard/notices");
  return { success: true };
}
