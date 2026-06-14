import { getDashboardStats, getAttendanceTrend, getReclaimStats } from "@/actions/dashboard";
import { getAuditLogs } from "@/actions/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  AttendanceTrendChart,
  PerformanceBarChart,
  ReclaimPieChart,
  FeeCollectionChart,
} from "@/components/dashboard/charts";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus, Bell, Search, Shield, TrendingUp,
  Users, Calendar, BookOpen, CreditCard, Activity,
} from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  { label: "Add Student", icon: UserPlus, href: "/dashboard/students", gradient: "gradient-brand" },
  { label: "Post Notice", icon: Bell, href: "/dashboard/notices", gradient: "gradient-admin" },
  { label: "ReClaim", icon: Search, href: "/dashboard/reclaim", gradient: "gradient-student" },
  { label: "Audit Logs", icon: Shield, href: "/dashboard/audit", gradient: "gradient-faculty" },
];

const ACTION_LOG_COLORS: Record<string, string> = {
  login: "#6366f1",
  reclaim_report: "#10b981",
  reclaim_claim: "#f59e0b",
  reclaim_approve: "#10b981",
  reclaim_reject: "#ef4444",
  create: "#0ea5e9",
  delete: "#ef4444",
  update: "#f59e0b",
  notice_publish: "#8b5cf6",
};

export default async function AdminDashboard() {
  const [stats, attendanceTrend, reclaimStats] = await Promise.all([
    getDashboardStats(),
    getAttendanceTrend(),
    getReclaimStats(),
  ]);

  // Safely try to load audit logs
  let recentActivity: Awaited<ReturnType<typeof getAuditLogs>> = [];
  try {
    recentActivity = await getAuditLogs({ limit: 5 });
  } catch {
    recentActivity = [];
  }

  const performanceData = [
    { subject: "Math", score: 82 },
    { subject: "Physics", score: 78 },
    { subject: "CS", score: 91 },
    { subject: "English", score: 85 },
    { subject: "History", score: 74 },
  ];

  const feeData = [
    { name: "Kabir", paid: 90000, due: 30000 },
    { name: "Ananya", paid: 120000, due: 0 },
  ];

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Admin Dashboard</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Campus overview &amp; live analytics</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)] glass border border-[var(--border)] rounded-xl px-3 py-2">
          <Activity className="h-3.5 w-3.5 text-[var(--brand)] animate-pulse" />
          Live data · Updated just now
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.label} href={a.href}>
            <div className="glass rounded-2xl border border-[var(--border)] p-4 flex flex-col items-center gap-2 hover:-translate-y-0.5 hover:shadow-glow-brand transition-all duration-200 cursor-pointer">
              <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${a.gradient}`}>
                <a.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[var(--muted)]">{a.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={stats.totalStudents} icon="users" delay={0} colorIndex={0} trend="+2 this month" trendDir="up" />
        <StatCard title="Total Faculty" value={stats.totalFaculty} icon="graduationCap" delay={0.08} colorIndex={1} trend="Stable" trendDir="neutral" />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon="calendar" delay={0.16} colorIndex={2} trend="+3% vs last month" trendDir="up" />
        <StatCard title="Fee Collection" value={formatCurrency(stats.feeCollection)} icon="creditCard" delay={0.24} colorIndex={3} trend="₹30K pending" trendDir="down" />
        <StatCard title="Active Notices" value={stats.activeNotices} icon="bell" delay={0.32} colorIndex={4} trend="2 published" trendDir="up" />
        <StatCard title="ReClaim Cases" value={stats.reclaimCases} icon="search" delay={0.4} colorIndex={5} trend="1 under review" trendDir="neutral" />
      </div>

      {/* Bento chart grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart
            title="Attendance Trends"
            description="Monthly attendance rate across all departments"
            data={attendanceTrend}
          />
        </div>
        <div>
          {reclaimStats.length > 0 ? (
            <ReclaimPieChart title="ReClaim Status" description="Item status breakdown" data={reclaimStats} />
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center">
              <Search className="h-8 w-8 text-[var(--muted)] mb-3 opacity-40" />
              <p className="text-sm text-[var(--muted)]">No ReClaim cases yet</p>
            </Card>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceBarChart title="Subject Performance" description="Average score per subject this semester" data={performanceData} />
        <FeeCollectionChart title="Fee Collection" description="Paid vs. outstanding per student" data={feeData} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest audit log entries</CardDescription>
          </div>
          <Link href="/dashboard/audit">
            <Button variant="outline" size="sm">View all</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-[var(--muted)] text-center py-6">No activity recorded yet.</p>
          ) : (
            recentActivity.map((log) => {
              const color = ACTION_LOG_COLORS[log.action] || "#6366f1";
              return (
                <div key={log.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--muted-bg)] transition-colors">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${color}18` }}
                  >
                    <Activity className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {(log.users as { full_name: string })?.full_name ?? "Unknown"}
                      <span className="font-normal text-[var(--muted)]"> · {log.action.replace(/_/g, " ")}</span>
                    </p>
                    <p className="text-xs text-[var(--muted)]">{log.resource} · {new Date(log.created_at).toLocaleString()}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 capitalize text-[10px]">{log.action.replace(/_/g, " ")}</Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
