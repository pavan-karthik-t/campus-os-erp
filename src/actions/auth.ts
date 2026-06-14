"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_PASSWORD, findDemoUserByEmail } from "@/lib/demo-data";
import { loginSchema, forgotPasswordSchema } from "@/lib/validations/auth";
import { logAudit } from "@/lib/audit/logger";
import { ROLE_ROUTES } from "@/lib/rbac/permissions";

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    totpCode: (formData.get("totpCode") as string) || undefined,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const user = findDemoUserByEmail(parsed.data.email);
  if (!user || parsed.data.password !== DEMO_PASSWORD) {
    return { error: "Use a demo account and password: password123" };
  }

  await logAudit({
    userId: user.id,
    action: "login",
    resource: "auth",
  });

  const cookieStore = await cookies();
  cookieStore.set("campusos_demo_role", user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(ROLE_ROUTES[user.role]);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("campusos_demo_role");
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  return { success: true, message: "Demo mode: use password123 to sign in." };
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  redirect("/login");
}
