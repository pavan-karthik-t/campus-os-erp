import React from "react";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { demoAuditLogs } from "@/lib/demo-data";
import { Shield, LogIn, UserPlus, Trash2, Edit, Bell, Package, CheckCircle2, XCircle, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" | "info" | "violet" }> = {
  login: { icon: LogIn, color: "#6366f1", label: "Login", variant: "default" },
  create: { icon: UserPlus, color: "#10b981", label: "Create", variant: "success" },
  delete: { icon: Trash2, color: "#ef4444", label: "Delete", variant: "destructive" },
  update: { icon: Edit, color: "#f59e0b", label: "Update", variant: "warning" },
  notice_publish: { icon: Bell, color: "#8b5cf6", label: "Publish", variant: "violet" },
  reclaim_report: { icon: Package, color: "#0ea5e9", label: "Report", variant: "info" },
  reclaim_claim: { icon: Package, color: "#f59e0b", label: "Claim", variant: "warning" },
  reclaim_approve: { icon: CheckCircle2, color: "#10b981", label: "Approve", variant: "success" },
  reclaim_reject: { icon: XCircle, color: "#ef4444", label: "Reject", variant: "destructive" },
  reclaim_handover: { icon: ArrowLeftRight, color: "#0ea5e9", label: "Handover", variant: "info" },
};

const RESOURCE_LABELS: Record<string, string> = {
  auth: "Authentication",
  students: "Students",
  notices: "Notices",
  attendance: "Attendance",
  reclaim_items: "ReClaim Items",
  reclaim_claims: "ReClaim Claims",
  reclaim_handover_logs: "Handover",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  return `${mins}m ago`;
}

export default async function AuditPage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "audit:read")) redirect("/dashboard");

  const logs = [...demoAuditLogs].sort(
    (a, b) => b.created_at.localeCompare(a.created_at)
  );

  const actionTypes = [...new Set(logs.map((l) => l.action))];

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Audit Logs</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {logs.length} events recorded · system-wide activity
          </p>
        </div>
        <div className="flex items-center gap-2 glass border border-[var(--border)] rounded-xl px-3 py-2">
          <Shield className="h-4 w-4 text-[var(--brand)]" />
          <span className="text-xs font-medium text-[var(--muted)]">Admin Only</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-[var(--brand)] text-white">
          All ({logs.length})
        </button>
        {actionTypes.map((action) => {
          const cfg = ACTION_CONFIG[action];
          return (
            <button
              key={action}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--muted-bg)] transition-colors"
            >
              {cfg && <cfg.icon className="h-3 w-3" style={{ color: cfg.color }} />}
              {cfg?.label ?? action} ({logs.filter((l) => l.action === action).length})
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>All system actions, newest first</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Shield className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
              <p className="text-sm text-[var(--muted)]">No audit events recorded</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-0">
              {/* Vertical line */}
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-[var(--border)]" />

              {logs.map((log, i) => {
                const cfg = ACTION_CONFIG[log.action] ?? { icon: Shield, color: "#6366f1", label: log.action, variant: "default" as const };
                const authorName = (log.users as { full_name: string })?.full_name ?? "System";
                const authorEmail = (log.users as { email: string })?.email ?? "";
                const resource = RESOURCE_LABELS[log.resource] ?? log.resource;

                return (
                  <div
                    key={log.id}
                    className={cn(
                      "relative flex gap-4 py-4",
                      i < logs.length - 1 && "border-b border-[var(--border)]"
                    )}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[1.1rem] flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--background)] shrink-0"
                      style={{ background: cfg.color }}
                    >
                      <cfg.icon className="h-2.5 w-2.5 text-white" />
                    </div>

                    {/* Left border stripe */}
                    <div
                      className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                      style={{ background: cfg.color, opacity: 0.4 }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex items-start gap-3">
                      <Avatar fallback={authorName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-[var(--foreground)]">{authorName}</p>
                          <Badge variant={cfg.variant as never} className="text-[10px]">{cfg.label}</Badge>
                          <span className="text-xs text-[var(--muted)]">on {resource}</span>
                          {log.resource_id && (
                            <span className="font-mono text-[10px] text-[var(--muted)] bg-[var(--muted-bg)] rounded px-1">
                              #{log.resource_id.slice(-6)}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[var(--muted)]">
                          {authorEmail && `${authorEmail} · `}
                          {log.ip_address && `IP: ${log.ip_address} · `}
                          {timeAgo(log.created_at)}
                        </p>
                      </div>
                      <time className="text-[10px] text-[var(--muted)] shrink-0 hidden sm:block">
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
