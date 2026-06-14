import { cookies } from "next/headers";
import { findDemoUserByRole } from "@/lib/demo-data";
import type { UserProfile, UserRole } from "@/types";

export async function getSession() {
  return getUserProfile();
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const role = cookieStore.get("campusos_demo_role")?.value as UserRole | undefined;
  return findDemoUserByRole(role);
}

export async function requireAuth() {
  const profile = await getUserProfile();
  if (!profile) throw new Error("Unauthorized");
  if (!profile.is_active) throw new Error("Account deactivated");
  return profile;
}
