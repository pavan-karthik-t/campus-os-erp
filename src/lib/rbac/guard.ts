import { hasPermission } from "./permissions";
import type { Permission, UserRole } from "@/types";

export function checkRouteAccess(role: UserRole, pathname: string): boolean {
  const routePermissions: Record<string, Permission> = {
    "/dashboard/students": "students:read",
    "/dashboard/attendance": "attendance:read",
    "/dashboard/marks": "marks:read",
    "/dashboard/timetable": "timetable:read",
    "/dashboard/notices": "notices:read",
    "/dashboard/fees": "fees:read",
    "/dashboard/reclaim": "reclaim:read",
    "/dashboard/audit": "audit:read",
  };

  for (const [route, permission] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return hasPermission(role, permission);
    }
  }
  return true;
}
