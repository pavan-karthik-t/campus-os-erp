import { getStudents } from "@/actions/students";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { UserPlus, Users, Search as SearchIcon, GraduationCap } from "lucide-react";

export default async function StudentsPage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "students:read")) redirect("/dashboard");

  let students: Awaited<ReturnType<typeof getStudents>> = [];
  try {
    students = await getStudents();
  } catch {
    students = [];
  }

  const departments = [...new Set(students.map((s) => s.department))];

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Student Records</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{students.length} students enrolled</p>
        </div>
        {hasPermission(profile.role, "students:write") && (
          <Button className="gap-2 shadow-glow-brand">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-[var(--brand)] text-white transition-colors">
          All ({students.length})
        </button>
        {departments.map((dept) => (
          <button
            key={dept}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--muted-bg)] transition-colors"
          >
            {dept} ({students.filter((s) => s.department === dept).length})
          </button>
        ))}
      </div>

      {/* Student grid */}
      {students.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-[var(--muted)] opacity-30 mb-4" />
          <p className="text-base font-semibold text-[var(--foreground)]">No students found</p>
          <p className="text-sm text-[var(--muted)] mt-1">Try adjusting your filters</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s, i) => {
            const name = (s.users as { full_name: string })?.full_name ?? "Unknown";
            return (
              <div
                key={s.id}
                className="glass rounded-2xl border border-[var(--border)] p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-glow-brand transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Avatar
                  role="student"
                  fallback={name}
                  size="lg"
                  showRing
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">{name}</p>
                  <p className="text-xs font-mono text-[var(--muted)] mt-0.5">{s.enrollment_number}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="secondary" className="text-[10px]">{s.department}</Badge>
                    <Badge variant="info" className="text-[10px]">Sem {s.semester}</Badge>
                    <Badge variant="outline" className="text-[10px]">Batch {s.batch_year}</Badge>
                  </div>
                </div>
                {hasPermission(profile.role, "students:delete") && (
                  <button className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors shrink-0">
                    <span className="sr-only">Delete</span>
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
