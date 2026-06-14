"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap, Shield, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const DEMO_ROLES = [
  {
    label: "Admin",
    icon: Shield,
    email: "admin@campusos.local",
    gradient: "gradient-admin",
    accent: "#8b5cf6",
    bg: "bg-[var(--accent-admin-bg)]",
    border: "border-[rgba(139,92,246,0.3)]",
  },
  {
    label: "Faculty",
    icon: BookOpen,
    email: "faculty@campusos.local",
    gradient: "gradient-faculty",
    accent: "#0ea5e9",
    bg: "bg-[var(--accent-faculty-bg)]",
    border: "border-[rgba(14,165,233,0.3)]",
  },
  {
    label: "Student",
    icon: Users,
    email: "student@campusos.local",
    gradient: "gradient-student",
    accent: "#10b981",
    bg: "bg-[var(--accent-student-bg)]",
    border: "border-[rgba(16,185,129,0.3)]",
  },
];

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "password123" },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) formData.append(k, v); });
    const result = await loginAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  };

  const quickSelect = (idx: number, email: string) => {
    setSelectedRole(idx);
    setValue("email", email);
    setValue("password", "password123");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      {/* Role quick-select */}
      <div className="mb-6">
        <p className="text-xs text-[var(--muted)] mb-3 text-center font-medium uppercase tracking-widest">
          Quick Select Role
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ROLES.map((r, i) => (
            <button
              key={r.label}
              type="button"
              onClick={() => quickSelect(i, r.email)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all duration-200",
                selectedRole === i
                  ? `${r.bg} ${r.border} scale-[0.98]`
                  : "border-[var(--border)] hover:bg-[var(--muted-bg)]"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", r.gradient)}>
                <r.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-semibold" style={{ color: selectedRole === i ? r.accent : "var(--muted)" }}>
                {r.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="glass rounded-2xl border border-[var(--border)] shadow-neu p-6 space-y-5">
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Welcome back</h2>
          <p className="text-sm text-[var(--muted)] mt-1">Sign in to your CampusOS account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@campusos.local"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Password
              </Label>
              <Link href="/forgot-password" className="text-xs text-[var(--brand)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[var(--danger)]">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full shadow-glow-brand"
            loading={loading}
            size="lg"
          >
            Sign In
          </Button>
        </form>

        {/* Hint */}
        <div className="rounded-xl bg-[var(--muted-bg)] border border-[var(--border)] p-3 text-center">
          <p className="text-xs text-[var(--muted)]">
            All demo accounts use password <span className="font-mono font-bold text-[var(--foreground)]">password123</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
