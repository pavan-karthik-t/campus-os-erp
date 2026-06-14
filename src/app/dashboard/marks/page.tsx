import { getMarks } from "@/actions/marks";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { calculateGPA } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SubjectRadarChart, PerformanceBarChart } from "@/components/dashboard/charts";
import { BookOpen, TrendingUp } from "lucide-react";

function getLetterGrade(pct: number) {
  if (pct >= 90) return { grade: "A+", color: "#10b981" };
  if (pct >= 80) return { grade: "A", color: "#10b981" };
  if (pct >= 70) return { grade: "B", color: "#0ea5e9" };
  if (pct >= 60) return { grade: "C", color: "#f59e0b" };
  if (pct >= 50) return { grade: "D", color: "#f59e0b" };
  return { grade: "F", color: "#ef4444" };
}

export default async function MarksPage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "marks:read")) redirect("/dashboard");

  let marks: Awaited<ReturnType<typeof getMarks>> = [];
  try {
    marks = await getMarks();
  } catch {
    marks = [];
  }

  const gpaNum = calculateGPA(marks);
  const gpa = gpaNum.toFixed(2);

  const chartData = marks.map((m) => ({
    subject: (m.subjects as { code: string })?.code ?? "—",
    score: Math.round((m.marks_obtained / m.max_marks) * 100),
  }));

  const radarData = marks.map((m) => ({
    subject: (m.subjects as { name: string })?.name?.slice(0, 8) ?? "—",
    score: Math.round((m.marks_obtained / m.max_marks) * 100),
  }));

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Marks &amp; Results</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Academic performance &amp; GPA</p>
        </div>
        {/* GPA Card */}
        <div className="glass rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4">
          <ProgressRing
            value={Math.min((gpaNum / 10) * 100, 100)}
            size={72}
            strokeWidth={7}
            color="#6366f1"
            label={gpa}
            sublabel="GPA"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Overall GPA</p>
            <p className="text-xs text-[var(--muted)]">Semester 4 · 2025–26</p>
            <Badge variant="default" className="mt-1 text-[10px]">
              <TrendingUp className="h-2.5 w-2.5" /> Good standing
            </Badge>
          </div>
        </div>
      </div>

      {/* Subject performance cards */}
      {marks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {marks.map((m, i) => {
            const pct = Math.round((m.marks_obtained / m.max_marks) * 100);
            const { grade, color } = getLetterGrade(pct);
            return (
              <div
                key={m.id}
                className="glass rounded-2xl border border-[var(--border)] p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-glow-brand transition-all duration-200"
              >
                <ProgressRing
                  value={pct}
                  size={64}
                  strokeWidth={6}
                  color={color}
                  label={`${pct}%`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">
                    {(m.subjects as { name: string })?.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {m.exam_type} · {m.marks_obtained}/{m.max_marks}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-base font-extrabold"
                      style={{ color }}
                    >
                      {grade}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {(m.subjects as { code: string })?.code}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      {marks.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <PerformanceBarChart
            title="Subject-wise Scores"
            description="Performance overview by subject"
            data={chartData}
          />
          <SubjectRadarChart
            title="Performance Radar"
            description="All subjects at a glance"
            data={radarData}
          />
        </div>
      )}

      {/* Marks table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Records</CardTitle>
          <CardDescription>All exam results</CardDescription>
        </CardHeader>
        <CardContent>
          {marks.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <BookOpen className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
              <p className="text-sm text-[var(--muted)]">No marks recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {marks.map((m) => {
                const pct = Math.round((m.marks_obtained / m.max_marks) * 100);
                const { grade, color } = getLetterGrade(pct);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-4 rounded-xl p-3 border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                        {(m.subjects as { name: string })?.name}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{m.exam_type} · Sem {m.semester}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--foreground)]">
                      {m.marks_obtained}/{m.max_marks}
                    </span>
                    <div className="h-1.5 w-20 rounded-full bg-[var(--muted-bg)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-sm font-extrabold w-8 text-right" style={{ color }}>{grade}</span>
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
