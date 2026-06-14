import Link from "next/link";
import { GraduationCap, Shield, Search, BarChart3, Users, Calendar, BookOpen, CreditCard, Bell, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Shield,
    title: "Role-Based Access",
    desc: "Three distinct portals — Admin, Faculty, Student — each with precisely scoped permissions and audit trails.",
    gradient: "gradient-admin",
    span: "md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Live charts for attendance trends, marks performance, fee collection, and ReClaim statistics.",
    gradient: "gradient-faculty",
    span: "",
  },
  {
    icon: Search,
    title: "ReClaim Lost & Found",
    desc: "Verified ownership workflow — report found items, submit claims, and admin-controlled handover.",
    gradient: "gradient-student",
    span: "",
  },
  {
    icon: Calendar,
    title: "Attendance Tracking",
    desc: "Faculty marks attendance per subject. Students see their attendance heatmap and percentage.",
    gradient: "gradient-brand",
    span: "",
  },
  {
    icon: BookOpen,
    title: "Marks & Results",
    desc: "Subject-wise marks, GPA calculation, and performance comparison across semesters.",
    gradient: "gradient-warning",
    span: "",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    desc: "Track total fee, paid amount, dues, payment history with UPI/Card support.",
    gradient: "gradient-admin",
    span: "md:col-span-2",
  },
];

const STATS = [
  { value: "3", label: "User Roles" },
  { value: "9+", label: "Modules" },
  { value: "100%", label: "TypeScript" },
  { value: "RBAC", label: "Security" },
];

const HIGHLIGHTS = [
  "Secure cookie-based session management",
  "Full audit log for every action",
  "CSRF protection & rate limiting",
  "Dark & light mode support",
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--background)" }}>
      {/* Background radial glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
        />
      </div>

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-glow-brand">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">CampusOS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="hidden sm:flex gap-2">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.08)] px-4 py-1.5 text-xs font-medium text-[var(--brand)] mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise-grade Campus Management
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
          <span className="gradient-text">CampusOS</span>
          <br />
          <span className="text-[var(--foreground)]">College ERP System</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
          A modern, role-aware ERP platform for institutions — managing students, attendance,
          marks, fees, notices, and lost &amp; found from one beautiful interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/login">
            <Button size="lg" className="gap-2 shadow-glow-brand w-full sm:w-auto">
              Enter as Admin <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 glass border border-[var(--border)] text-center"
            >
              <p className="text-2xl font-extrabold gradient-text">{s.value}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role Selector Preview ─────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-8">
          Three role portals, one unified platform
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              role: "Administrator",
              gradient: "gradient-admin",
              glow: "shadow-glow-admin",
              desc: "Full platform control — manage students, faculty, fees, notices, and view audit logs.",
              items: ["Student management", "Fee tracking", "Audit logs", "All modules"],
              accent: "#8b5cf6",
            },
            {
              role: "Faculty",
              gradient: "gradient-faculty",
              glow: "shadow-glow-faculty",
              desc: "Focused on teaching — mark attendance, enter grades, view your class timetable.",
              items: ["Mark attendance", "Enter grades", "Class timetable", "Post notices"],
              accent: "#0ea5e9",
            },
            {
              role: "Student",
              gradient: "gradient-student",
              glow: "shadow-glow-student",
              desc: "Your academic life at a glance — attendance, results, fees, notices, ReClaim.",
              items: ["View attendance", "Check results", "Fee status", "ReClaim lost items"],
              accent: "#10b981",
            },
          ].map((r) => (
            <div
              key={r.role}
              className="glass rounded-2xl border border-[var(--border)] overflow-hidden hover:-translate-y-1 transition-transform duration-200"
            >
              <div className={`h-1.5 w-full ${r.gradient}`} />
              <div className="p-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${r.gradient} mb-4`}>
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: r.accent }}>{r.role}</h3>
                <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">{r.desc}</p>
                <ul className="space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: r.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Bento Grid ────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--muted)] mb-8">
          Everything you need in one system
        </p>
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`glass rounded-2xl border border-[var(--border)] p-6 group hover:-translate-y-1 transition-all duration-200 ${f.span}`}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold mb-2 text-[var(--foreground)]">{f.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Security Highlights ───────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-[rgba(99,102,241,0.2)] glass p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl gradient-admin shadow-glow-admin">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Built with security in mind</h3>
            <p className="text-sm text-[var(--muted)] mb-4">Every action is guarded by RBAC, input validation, audit logging, and rate limiting.</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {HIGHLIGHTS.map((h) => (
                <span key={h} className="inline-flex items-center gap-1.5 text-xs rounded-full border border-[rgba(99,102,241,0.25)] bg-[rgba(99,102,241,0.08)] px-3 py-1 text-[var(--brand)]">
                  <CheckCircle2 className="h-3 w-3" /> {h}
                </span>
              ))}
            </div>
          </div>
          <Link href="/login">
            <Button size="lg" className="shrink-0 gap-2 shadow-glow-brand">
              Try Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[var(--border)] mt-8 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[var(--brand)]" />
            <span className="text-sm font-semibold gradient-text">CampusOS</span>
            <span className="text-xs text-[var(--muted)] ml-2">v0.1.0 · Local Demo</span>
          </div>
          <p className="text-xs text-[var(--muted)] text-center">
            Designed &amp; Developed by{" "}
            <span className="font-semibold text-[var(--brand)]">Kasindula Chaitanya</span>
          </p>
          <p className="text-xs text-[var(--muted)]">Next.js · TypeScript · Tailwind CSS · Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
