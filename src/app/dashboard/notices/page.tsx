import { getNotices } from "@/actions/notices";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Bell, Plus, Pin, Users, GraduationCap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const AUDIENCE_CONFIG = {
  all: { label: "Everyone", icon: Globe, variant: "default" as const, color: "#6366f1" },
  students: { label: "Students", icon: Users, variant: "success" as const, color: "#10b981" },
  faculty: { label: "Faculty", icon: GraduationCap, variant: "info" as const, color: "#0ea5e9" },
};

const STATUS_CONFIG = {
  published: { variant: "success" as const },
  draft: { variant: "warning" as const },
  archived: { variant: "secondary" as const },
};

export default async function NoticesPage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "notices:read")) redirect("/dashboard");

  let notices: Awaited<ReturnType<typeof getNotices>> = [];
  try {
    notices = await getNotices(profile.role === "student" ? "published" : undefined);
  } catch {
    notices = [];
  }

  const published = notices.filter((n) => (n.status as string) === "published");
  const drafts = notices.filter((n) => (n.status as string) === "draft");

  // Pin the first published notice
  const pinned = published[0];
  const rest = published.slice(1);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Notices</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {published.length} published · {drafts.length} draft
          </p>
        </div>
        {hasPermission(profile.role, "notices:write") && (
          <Button className="gap-2 shadow-glow-brand">
            <Plus className="h-4 w-4" />
            New Notice
          </Button>
        )}
      </div>

      {notices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
          <p className="text-sm text-[var(--muted)]">No notices available</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Pinned notice */}
          {pinned && (
            <div
              className="relative rounded-2xl border p-5 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))",
                borderColor: "rgba(99,102,241,0.25)",
              }}
            >
              {/* Gradient strip */}
              <div className="absolute top-0 left-0 right-0 h-0.5 gradient-brand" />

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-brand">
                  <Pin className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand)]">Pinned</span>
                    <Badge variant="success" className="text-[10px]">Published</Badge>
                    {(() => {
                      const aud = AUDIENCE_CONFIG[pinned.target_audience as keyof typeof AUDIENCE_CONFIG];
                      return aud ? (
                        <Badge variant={aud.variant} className="text-[10px]">
                          <aud.icon className="h-2.5 w-2.5" /> {aud.label}
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                  <h2 className="text-base font-bold text-[var(--foreground)] mb-1">{pinned.title}</h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{pinned.content}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Avatar
                      fallback={(pinned.users as { full_name: string })?.full_name ?? "?"}
                      role={profile.role === "administrator" ? "administrator" : "faculty"}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-medium text-[var(--foreground)]">
                        {(pinned.users as { full_name: string })?.full_name}
                      </p>
                      <p className="text-[10px] text-[var(--muted)]">{formatDate(pinned.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Draft notices (admin/faculty only) */}
          {drafts.length > 0 && hasPermission(profile.role, "notices:write") && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Drafts</p>
              {drafts.map((n) => (
                <NoticeCard key={n.id} notice={n} profile={profile} />
              ))}
            </div>
          )}

          {/* Published notices */}
          {rest.length > 0 && (
            <div className="space-y-3">
              {pinned && <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">All Announcements</p>}
              {rest.map((n) => (
                <NoticeCard key={n.id} notice={n} profile={profile} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NoticeCard({ notice, profile }: { notice: ReturnType<typeof Object.assign>; profile: { role: string } }) {
  const aud = AUDIENCE_CONFIG[(notice.target_audience as keyof typeof AUDIENCE_CONFIG)] ?? AUDIENCE_CONFIG.all;
  const statusCfg = STATUS_CONFIG[(notice.status as keyof typeof STATUS_CONFIG)] ?? STATUS_CONFIG.draft;
  const authorName = (notice.users as { full_name: string })?.full_name ?? "Unknown";

  return (
    <div className="glass rounded-2xl border border-[var(--border)] p-4 flex gap-4 hover:-translate-y-0.5 hover:shadow-glow-brand transition-all duration-200">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${aud.color}18` }}
      >
        <aud.icon className="h-4 w-4" style={{ color: aud.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <Badge variant={statusCfg.variant} className="text-[10px] capitalize">{notice.status}</Badge>
          <Badge variant={aud.variant} className="text-[10px]">{aud.label}</Badge>
        </div>
        <h3 className="text-sm font-bold text-[var(--foreground)] truncate">{notice.title}</h3>
        <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{notice.content}</p>
        <div className="flex items-center gap-2 mt-2">
          <Avatar fallback={authorName} size="sm" />
          <p className="text-[10px] text-[var(--muted)]">
            {authorName} · {formatDate(notice.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
