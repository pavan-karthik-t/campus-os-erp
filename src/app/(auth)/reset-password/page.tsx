"use client";

import { useState } from "react";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft, ShieldCheck } from "lucide-react";

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#10b981", "#10b981"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;
  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score] : "var(--muted-bg)" }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-[10px]" style={{ color: colors[score] }}>
          {labels[score]}
        </p>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mismatch) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await resetPasswordAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      setDone(true);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-glow-brand">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">CampusOS</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-[var(--border)] shadow-neu p-8">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Icon + heading */}
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand shadow-glow-brand">
                    <KeyRound className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-[var(--foreground)]">Create new password</h1>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      Choose a strong password for your account
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        className="pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <PasswordStrengthBar password={password} />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        required
                        placeholder="Repeat your password"
                        className={`pr-10 ${mismatch ? "border-[var(--danger)]" : ""}`}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {mismatch && (
                      <p className="text-xs text-[var(--danger)]">Passwords do not match</p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="rounded-xl bg-[var(--muted-bg)] border border-[var(--border)] p-3 space-y-1.5">
                    {[
                      { check: password.length >= 8, label: "At least 8 characters" },
                      { check: /[A-Z]/.test(password), label: "One uppercase letter" },
                      { check: /[0-9]/.test(password), label: "One number" },
                    ].map(({ check, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div
                          className="h-3.5 w-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
                          style={{ background: check ? "#10b981" : "var(--border)" }}
                        >
                          {check && (
                            <svg viewBox="0 0 12 12" className="h-2 w-2 fill-white">
                              <path d="M10 3L5 8 2 5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-[var(--muted)]">{label}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-glow-brand"
                    size="lg"
                    loading={loading}
                    disabled={mismatch || password.length < 8}
                  >
                    Update Password
                  </Button>
                </form>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5 py-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-student shadow-glow-student">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Password updated!</h2>
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                    Your password has been changed successfully. You can now sign in with your new password.
                  </p>
                </div>

                <Link href="/login">
                  <Button className="w-full shadow-glow-brand gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Go to Login
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
