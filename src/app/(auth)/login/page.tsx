import { LoginForm } from "@/components/auth/login-form";
import { GraduationCap, BarChart3, Calendar, Shield, Search } from "lucide-react";

const FLOATING_CARDS = [
  { icon: BarChart3, label: "Analytics", value: "98% attendance", color: "#6366f1" },
  { icon: Calendar, label: "Today", value: "4 classes", color: "#10b981" },
  { icon: Shield, label: "Security", value: "RBAC enabled", color: "#8b5cf6" },
  { icon: Search, label: "ReClaim", value: "2 active cases", color: "#0ea5e9" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex w-[48%] flex-col justify-between relative overflow-hidden p-12"
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #0d0d14 60%, #111118 100%)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Glow orbs */}
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-glow-brand">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">CampusOS</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              The ERP your campus<br />
              <span className="gradient-text">deserves.</span>
            </h1>
            <p className="text-[#a1a1aa] text-base leading-relaxed max-w-sm">
              Manage students, faculty, attendance, marks, fees, and lost &amp; found — 
              all from one role-aware, secure platform.
            </p>
          </div>

          {/* Floating feature cards */}
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            {FLOATING_CARDS.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border p-3.5 animate-float"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: `${card.color}30`,
                  animationDelay: `${FLOATING_CARDS.indexOf(card) * 0.4}s`,
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg mb-2"
                  style={{ background: `${card.color}20` }}
                >
                  <card.icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
                <p className="text-[11px] text-[#71717a]">{card.label}</p>
                <p className="text-sm font-semibold text-white">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10 space-y-0.5">
          <p className="text-[9px] font-medium uppercase tracking-widest text-[#52525b]">
            Designed &amp; Developed by
          </p>
          <p
            className="text-lg font-extrabold tracking-tight leading-tight"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Kasindula Chaitanya
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex flex-1 items-center justify-center p-6 relative">
        {/* Background radial */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.08), transparent)" }}
        />

        <div className="relative z-10 w-full flex flex-col items-center gap-6">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-glow-brand">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CampusOS</span>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
