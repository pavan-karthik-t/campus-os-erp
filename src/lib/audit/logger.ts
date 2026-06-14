import { headers } from "next/headers";

export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "reclaim_report"
  | "reclaim_claim"
  | "reclaim_approve"
  | "reclaim_reject"
  | "reclaim_handover"
  | "permission_change"
  | "notice_publish";

interface AuditEntry {
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    console.info("Demo audit", {
      user_id: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId,
      ip_address: ip,
      user_agent: userAgent,
      metadata: entry.metadata || {},
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
