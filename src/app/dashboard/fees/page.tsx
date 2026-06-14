import React from "react";
import { getUserProfile } from "@/lib/auth/session";
import { hasPermission } from "@/lib/rbac/permissions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { demoFees } from "@/lib/demo-data";
import { CreditCard, TrendingDown, CheckCircle2, AlertTriangle, Smartphone, CreditCard as CardIcon } from "lucide-react";

const STATUS_CONFIG = {
  paid: { variant: "success" as const, icon: CheckCircle2, color: "#10b981", label: "Paid" },
  partial: { variant: "warning" as const, icon: AlertTriangle, color: "#f59e0b", label: "Partial" },
  overdue: { variant: "destructive" as const, icon: TrendingDown, color: "#ef4444", label: "Overdue" },
  pending: { variant: "secondary" as const, icon: CreditCard, color: "#6366f1", label: "Pending" },
};

const METHOD_ICON: Record<string, React.ElementType> = {
  UPI: Smartphone,
  Card: CardIcon,
};

export default async function FeesPage() {
  const profile = await getUserProfile();
  if (!profile || !hasPermission(profile.role, "fees:read")) redirect("/dashboard");

  const fees =
    profile.role === "student"
      ? demoFees.filter((fee) => fee.student_id === "student-1")
      : demoFees;

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Fee Status</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Payment history and outstanding dues</p>
      </div>

      {fees.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <CreditCard className="h-10 w-10 text-[var(--muted)] opacity-30 mb-3" />
          <p className="text-sm text-[var(--muted)]">No fee records found</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {fees.map((f) => {
            const cfg = STATUS_CONFIG[f.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
            const paidPct = Math.round((Number(f.paid_amount) / Number(f.total_fee)) * 100);
            const studentName = (f.students as { users: { full_name: string } })?.users?.full_name;

            return (
              <Card key={f.id} variant="gradient">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    {profile.role !== "student" && studentName && (
                      <CardTitle className="text-base">{studentName}</CardTitle>
                    )}
                    <CardDescription className="mt-1">
                      Academic Year: <span className="font-semibold text-[var(--foreground)]">{f.academic_year}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={cfg.variant} dot className="shrink-0 text-xs capitalize">
                    {f.status}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Fee amounts */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-[var(--muted-bg)] p-3 text-center">
                      <p className="text-xs text-[var(--muted)] mb-1">Total Fee</p>
                      <p className="text-base font-extrabold text-[var(--foreground)]">
                        {formatCurrency(Number(f.total_fee))}
                      </p>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: "rgba(16,185,129,0.08)" }}>
                      <p className="text-xs text-[#10b981] mb-1">Paid</p>
                      <p className="text-base font-extrabold text-[#10b981]">
                        {formatCurrency(Number(f.paid_amount))}
                      </p>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: Number(f.due_amount) > 0 ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)" }}>
                      <p className="text-xs mb-1" style={{ color: Number(f.due_amount) > 0 ? "#ef4444" : "#10b981" }}>Due</p>
                      <p className="text-base font-extrabold" style={{ color: Number(f.due_amount) > 0 ? "#ef4444" : "#10b981" }}>
                        {formatCurrency(Number(f.due_amount))}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
                      <span>Payment progress</span>
                      <span className="font-semibold">{paidPct}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[var(--muted-bg)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${paidPct}%`,
                          background: paidPct === 100 ? "linear-gradient(90deg, #10b981, #0ea5e9)" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        }}
                      />
                    </div>
                    {f.due_date && Number(f.due_amount) > 0 && (
                      <p className="text-xs text-[#f59e0b] mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Due by {formatDate(f.due_date)}
                      </p>
                    )}
                  </div>

                  {/* Payment history */}
                  {f.payment_history && f.payment_history.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
                        Payment History
                      </p>
                      <div className="space-y-2">
                        {f.payment_history.map((p, i) => {
                          const MethodIcon = METHOD_ICON[p.method] ?? CreditCard;
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-student">
                                <MethodIcon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-[var(--foreground)]">{p.method} Payment</p>
                                <p className="text-[10px] text-[var(--muted)]">{formatDate(p.date)}</p>
                              </div>
                              <span className="text-sm font-bold text-[#10b981]">
                                +{formatCurrency(p.amount)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
