"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { logAudit } from "@/lib/audit/logger";
import { demoReclaimItems } from "@/lib/demo-data";
import { reportItemSchema, claimItemSchema, reviewClaimSchema } from "@/lib/validations/reclaim";

export async function getReclaimItems() {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "reclaim:read")) throw new Error("Forbidden");

  const isAdmin = profile.role === "administrator";
  return demoReclaimItems
    .map((item) => isAdmin ? item : { ...item, hidden_identifiers: "" })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function reportFoundItem(formData: FormData) {
  const profile = await requireAuth();

  const parsed = reportItemSchema.safeParse({
    category: formData.get("category"),
    location_found: formData.get("location_found"),
    date_found: formData.get("date_found"),
    hidden_identifiers: formData.get("hidden_identifiers"),
    description: formData.get("description"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await logAudit({ userId: profile.id, action: "reclaim_report", resource: "reclaim_items", metadata: parsed.data });
  revalidatePath("/dashboard/reclaim");
  return { success: true };
}

export async function submitClaim(formData: FormData) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "reclaim:write")) return { error: "Forbidden" };

  const parsed = claimItemSchema.safeParse({
    item_id: formData.get("item_id"),
    description: formData.get("description"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await logAudit({ userId: profile.id, action: "reclaim_claim", resource: "reclaim_claims", metadata: parsed.data });
  revalidatePath("/dashboard/reclaim");
  return { success: true };
}

export async function reviewClaim(formData: FormData) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "reclaim:admin")) return { error: "Forbidden" };

  const parsed = reviewClaimSchema.safeParse({
    claim_id: formData.get("claim_id"),
    decision: formData.get("decision"),
    admin_notes: formData.get("admin_notes"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const status = parsed.data.decision === "approved" ? "approved" : "rejected";

  await logAudit({
    userId: profile.id,
    action: status === "approved" ? "reclaim_approve" : "reclaim_reject",
    resource: "reclaim_claims",
    resourceId: parsed.data.claim_id,
    metadata: parsed.data,
  });

  revalidatePath("/dashboard/reclaim");
  return { success: true };
}

export async function completeHandover(formData: FormData) {
  const profile = await requireAuth();
  if (!hasPermission(profile.role, "reclaim:admin")) return { error: "Forbidden" };

  const itemId = formData.get("item_id") as string;
  const claimId = formData.get("claim_id") as string;

  await logAudit({
    userId: profile.id,
    action: "reclaim_handover",
    resource: "reclaim_handover_logs",
    resourceId: claimId,
    metadata: { itemId },
  });
  revalidatePath("/dashboard/reclaim");
  return { success: true };
}
