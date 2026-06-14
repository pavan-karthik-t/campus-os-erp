import { getUserProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { demoAttendance, demoMarks, demoNotices, demoTimetables } from "@/lib/demo-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceTrendChart } from "@/components/dashboard/charts";
import { Clock, Users, Calendar, BookOpen, Bell, CheckCircle2, XCircle, Clock3 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function FacultyDashboard() {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "faculty") redirect("/dashboard");

  const today = new Date();
  const todayDow = today.getDay(); // 0=Sun,1=Mon...

  const todayClasses = demoTimetables.filter((t) => t.day_of_week === todayDow);

  const attendanceTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => ({
    month,
    rate: 70 + Math.round(Math.random() * 25),
  }));

  const attendanceStats = {
    present: demoAttendance.filter((a) => a.status === "present").length,
    absent: demoAttendance.filter((a) => a.status === "absent").length,
    late: demoAttendance.filter((a) => a.status === "late").length,
  };

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
          Good {today.getHours() < 12 ? "morning" : today.getHours() < 18 ? "afternoon" : "evening"},{" "}
          <span className="gradient-text-faculty">{profile.full_name.split(" ")[1] ?? profile.full_name}</span>
        </h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">{DAYS[todayDow]}, {today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Classes" value={2} icon="book" delay={0} colorIndex={1} subtitle="Subjects assigned" />
        <StatCard title="Students" value={demoAttendance.length} icon="users" delay={0.08} colorIndex={0} subtitle="In your classes" />
        <StatCard title="Attendance Marked" value={demoAttendance.length} icon="calendar" delay={0.16} colorIndex={2} trend="Today" trendDir="up" />
        <StatCard title="Notices Posted" value={demoNotices.filter((n) => n.author_id === "user-faculty").length} icon="bell" delay={0.24} colorIndex={3} />
      </div>

      {/* Today's timetable + Attendance summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--brand)]" />
              Today&apos;s Classes
            </CardTitle>
            <CardDescription>{DAYS[todayDow]}&apos;s schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-[#10b981] mb-3 opacity-60" />
                <p className="text-sm font-medium text-[var(--foreground)]">No classes today</p>
                <p className="text-xs text-[var(--muted)]">Enjoy your day!</p>
              </div>
            ) : (
              todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 rounded-xl p-3 border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-faculty">
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
                  <Badge variant="info">{(cls.subjects as { code: string })?.code}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Attendance summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--brand)]" />
              Attendance Summary
            </CardTitle>
            <CardDescription>All sessions recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Present", value: attendanceStats.present, icon: CheckCircle2, color: "#10b981" },
                { label: "Absent", value: attendanceStats.absent, icon: XCircle, color: "#ef4444" },
                { label: "Late", value: attendanceStats.late, icon: Clock3, color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center border border-[var(--border)]" style={{ background: `${s.color}10` }}>
                  <s.icon className="h-5 w-5 mx-auto mb-1" style={{ color: s.color }} />
                  <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-[var(--muted)]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {demoAttendance.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between text-xs py-2 border-b border-[var(--border)] last:border-0">
                  <span className="text-[var(--foreground)] font-medium">
                    {(a.students as { users: { full_name: string } })?.users?.full_name}
                  </span>
                  <Badge
                    variant={a.status === "present" ? "success" : a.status === "absent" ? "destructive" : "warning"}
                    dot
                    className="capitalize"
                  >
                    {a.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance trend */}
      <AttendanceTrendChart
        title="My Class Attendance Trend"
        description="Monthly attendance rate for your subjects"
        data={attendanceTrend}
      />

      {/* Recent notices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--brand)]" />
            Recent Notices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {demoNotices.slice(0, 2).map((n) => (
            <div key={n.id} className="flex items-start gap-3 rounded-xl p-3 border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-admin">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">{n.title}</p>
                <p className="text-xs text-[var(--muted)]">{n.content.slice(0, 60)}...</p>
              </div>
              <Badge variant={n.target_audience === "all" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                {n.target_audience}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
