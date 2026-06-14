import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");

  return (
    <DashboardShell role={profile.role} userName={profile.full_name}>
      {children}
    </DashboardShell>
  );
}
