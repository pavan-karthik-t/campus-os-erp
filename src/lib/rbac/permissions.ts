import type { Permission, UserRole } from "@/types";

const ADMIN_PERMISSIONS: Permission[] = [
  "students:read", "students:write", "students:delete",
  "attendance:read", "attendance:write",
  "marks:read", "marks:write",
  "timetable:read", "timetable:write",
  "notices:read", "notices:write",
  "fees:read", "fees:write",
  "reclaim:read", "reclaim:write", "reclaim:admin",
  "audit:read", "users:manage",
];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  administrator: ADMIN_PERMISSIONS,
  faculty: [
    "students:read",
    "attendance:read",
    "attendance:write",
    "marks:read",
    "marks:write",
    "notices:read",
    "notices:write",
    "timetable:read",
  ],
  student: [
    "attendance:read",
    "marks:read",
    "timetable:read",
    "notices:read",
    "fees:read",
    "reclaim:read",
    "reclaim:write",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export const ROLE_ROUTES: Record<UserRole, string> = {
  administrator: "/dashboard/admin",
  faculty: "/dashboard/faculty",
  student: "/dashboard/student",
};

export const PROTECTED_ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/dashboard/students": ["students:read"],
  "/dashboard/attendance": ["attendance:read"],
  "/dashboard/marks": ["marks:read"],
  "/dashboard/timetable": ["timetable:read"],
  "/dashboard/notices": ["notices:read"],
  "/dashboard/fees": ["fees:read"],
  "/dashboard/reclaim": ["reclaim:read"],
  "/dashboard/audit": ["audit:read"],
  "/dashboard/users": ["users:manage"],
};
