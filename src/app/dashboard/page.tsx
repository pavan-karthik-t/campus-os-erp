import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/session";
import { ROLE_ROUTES } from "@/lib/rbac/permissions";

export default async function DashboardRedirect() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  redirect(ROLE_ROUTES[profile.role]);
}
