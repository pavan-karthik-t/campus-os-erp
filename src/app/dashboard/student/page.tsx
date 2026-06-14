import { getUserProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { demoAttendance, demoFees, demoMarks, demoNotices, demoTimetables } from "@/lib/demo-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { calculateGPA } from "@/lib/utils";
import { Bell, BookOpen, Clock, CreditCard, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function StudentDashboard() {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "student") redirect("/dashboard");

  const today = new Date();
  const todayDow = today.getDay();

  const todayClasses = demoTimetables.filter((t) => t.day_of_week === todayDow);
  const studentMarks = demoMarks.filter((m) => m.student_id === "student-1");
  const studentFee = demoFees.find((f) => f.student_id === "student-1");
  const studentAttendance = demoAttendance.filter((a) => a.student_id === "student-1");
  const gpaNum = calculateGPA(studentMarks);
  const gpa = gpaNum.toFixed(2);

  const presentCount = studentAttendance.filter((a) => a.status === "present").length;
  const attendancePct = studentAttendance.length > 0
    ? Math.round((presentCount / studentAttendance.length) * 100)
    : 0;

  const feeProgress = studentFee
    ? Math.round((Number(studentFee.paid_amount) / Number(studentFee.total_fee)) * 100)
    : 0;

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
            Hey, <span className="gradient-text-student">{profile.full_name.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {DAYS[todayDow]}, {today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        {/* GPA Ring */}
        <div className="glass rounded-2xl border border-[var(--border)] p-4 flex items-center gap-4">
          <ProgressRing
            value={Math.min((gpaNum / 10) * 100, 100)}
            size={80}
            strokeWidth={8}
            color="#10b981"
            label={gpa}
            sublabel="GPA"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Academic Score</p>
            <p className="text-xs text-[var(--muted)]">Semester 4 · 2025–26</p>
            <Badge variant="success" className="mt-1">
              <TrendingUp className="h-2.5 w-2.5" /> On track
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Attendance Ring card */}
        <Card className="flex flex-col items-center p-6 gap-3">
          <ProgressRing
            value={attendancePct}
            size={96}
            strokeWidth={9}
            color={attendancePct >= 75 ? "#10b981" : "#f59e0b"}
            label={`${attendancePct}%`}
            sublabel="Attend."
          />
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--foreground)]">Attendance</p>
            {attendancePct < 75 && (
              <p className="text-xs text-[#f59e0b] flex items-center gap-1 justify-center mt-1">
                <AlertTriangle className="h-3 w-3" /> Below 75%
              </p>
            )}
          </div>
        </Card>

        {/* Fee progress card */}
        {studentFee && (
          <Card className="p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-[var(--brand)]" />
              <p className="text-sm font-semibold text-[var(--foreground)]">Fee Status</p>
              <Badge
                variant={(studentFee.status as string) === "paid" ? "success" : (studentFee.status as string) === "overdue" ? "destructive" : "warning"}
                className="ml-auto text-[10px] capitalize"
              >
                {studentFee.status}
              </Badge>
            </div>
            <div className="relative h-3 w-full bg-[var(--muted-bg)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-student transition-all duration-700"
                style={{ width: `${feeProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
              <span>Paid: ₹{(Number(studentFee.paid_amount) / 1000).toFixed(0)}K</span>
              <span>Due: ₹{(Number(studentFee.due_amount) / 1000).toFixed(0)}K</span>
            </div>
          </Card>
        )}

        {/* Marks highlight */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-[var(--brand)]" />
            <p className="text-sm font-semibold text-[var(--foreground)]">Recent Marks</p>
          </div>
          <div className="space-y-3">
            {studentMarks.slice(0, 2).map((m) => {
              const pct = Math.round((m.marks_obtained / m.max_marks) * 100);
              return (
                <div key={m.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted)] truncate">
                      {(m.subjects as { name: string })?.name}
                    </span>
                    <span className="font-bold text-[var(--foreground)]">{m.marks_obtained}/{m.max_marks}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--muted-bg)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-brand transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {studentMarks.length === 0 && (
              <p className="text-xs text-[var(--muted)] text-center py-4">No marks yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--brand)]" />
            Today&apos;s Classes
          </CardTitle>
          <CardDescription>{DAYS[todayDow]}&apos;s schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {todayClasses.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-[#10b981] mb-3 opacity-60" />
              <p className="text-sm font-medium text-[var(--foreground)]">No classes today</p>
              <p className="text-xs text-[var(--muted)]">Enjoy your free day!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 rounded-xl p-3 border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-student">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {(cls.subjects as { name: string })?.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {cls.start_time} – {cls.end_time} · Room {cls.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="info" className="text-[10px]">{(cls.subjects as { code: string })?.code}</Badge>
                    <p className="text-[10px] text-[var(--muted)] mt-1">
                      {(cls.faculty as { users: { full_name: string } })?.users?.full_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--brand)]" />
            Recent Notices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {demoNotices.filter((n) => n.target_audience === "all" || n.target_audience === "students").map((n) => (
            <div key={n.id} className="flex items-start gap-3 rounded-xl p-3 border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-brand">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">{n.title}</p>
                <p className="text-xs text-[var(--muted)]">{n.content.slice(0, 70)}...</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
