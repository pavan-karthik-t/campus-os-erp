import { getAttendance } from "@/actions/attendance";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, CheckCircle2, XCircle, Clock3, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  present: { label: "Present", variant: "success" as const, icon: CheckCircle2, color: "#10b981", dot: "bg-[#10b981]" },
  absent: { label: "Absent", variant: "destructive" as const, icon: XCircle, color: "#ef4444", dot: "bg-[#ef4444]" },
  late: { label: "Late", variant: "warning" as const, icon: Clock3, color: "#f59e0b", dot: "bg-[#f59e0b]" },
  excused: { label: "Excused", variant: "violet" as const, icon: Bookmark, color: "#8b5cf6", dot: "bg-[#8b5cf6]" },
};

export default async function AttendancePage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "attendance:read")) redirect("/dashboard");

  let records: Awaited<ReturnType<typeof getAttendance>> = [];
  try {
    records = await getAttendance();
  } catch {
    records = [];
  }

  const counts = {
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => (r.status as string) === "excused").length,
  };
  const total = records.length;
  const rate = total > 0 ? Math.round((counts.present / total) * 100) : 0;

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Attendance</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{records.length} records · {rate}% attendance rate</p>
        </div>
        {hasPermission(profile.role, "attendance:write") && (
          <button className="inline-flex items-center gap-2 rounded-xl gradient-brand text-white px-4 h-10 text-sm font-medium shadow-glow-brand hover:opacity-90 transition-all">
            <Calendar className="h-4 w-4" />
            Mark Attendance
          </button>
        )}
      </div>

      {/* Status summary */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
          <div
            key={key}
            className="glass rounded-2xl border border-[var(--border)] p-4 text-center"
            style={{ background: `${cfg.color}08` }}
          >
            <cfg.icon className="h-6 w-6 mx-auto mb-2" style={{ color: cfg.color }} />
            <p className="text-2xl font-extrabold" style={{ color: cfg.color }}>{counts[key]}</p>
            <p className="text-xs text-[var(--muted)]">{cfg.label}</p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">Overall Attendance Rate</p>
            <span className="text-lg font-extrabold" style={{ color: rate >= 75 ? "#10b981" : "#f59e0b" }}>{rate}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-[var(--muted-bg)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${rate}%`,
                background: rate >= 75 ? "linear-gradient(90deg, #10b981, #0ea5e9)" : "linear-gradient(90deg, #f59e0b, #ef4444)",
              }}
            />
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">
            {rate < 75 ? "⚠️ Below 75% — attendance is at risk." : "✅ Attendance is healthy."}
          </p>
        </CardContent>
      </Card>

      {/* Records list */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>All sessions across subjects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {records.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Calendar className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
              <p className="text-sm text-[var(--muted)]">No attendance records found</p>
            </div>
          ) : (
            records.map((r) => {
              const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.present;
              const studentName = (r.students as { users: { full_name: string } })?.users?.full_name ?? "Unknown";
              const subjectName = (r.subjects as { name: string; code: string })?.name ?? "—";
              const subjectCode = (r.subjects as { code: string })?.code ?? "—";
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-4 rounded-xl p-3 border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors"
                >
                  <Avatar role="student" fallback={studentName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">{studentName}</p>
                    <p className="text-xs text-[var(--muted)]">{subjectName} · {r.date}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{subjectCode}</Badge>
                  <Badge variant={cfg.variant} dot className="shrink-0 capitalize">{r.status}</Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
