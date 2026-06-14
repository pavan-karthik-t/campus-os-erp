"use client";

import { useState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, ArrowLeft, CheckCircle2, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      setSent(true);
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
          className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full opacity-10 blur-3xl"
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
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Icon + heading */}
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-admin shadow-glow-admin">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-[var(--foreground)]">Reset your password</h1>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      Enter your email and we&apos;ll send a reset link
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@campusos.local"
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full shadow-glow-brand"
                    size="lg"
                    loading={loading}
                  >
                    Send Reset Link
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
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Email sent!</h2>
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-semibold text-[var(--foreground)]">{email}</span>.
                    Check your inbox.
                  </p>
                </div>

                {/* Info box */}
                <div className="rounded-xl bg-[var(--muted-bg)] border border-[var(--border)] p-3">
                  <p className="text-xs text-[var(--muted)]">
                    Didn&apos;t receive it? Check your spam folder or{" "}
                    <button
                      onClick={() => setSent(false)}
                      className="font-semibold text-[var(--brand)] hover:underline"
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>

                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
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
