import { hasPermission, getRolePermissions } from "@/lib/rbac/permissions";

describe("RBAC Permissions", () => {
  it("administrator has all permissions", () => {
    expect(hasPermission("administrator", "students:write")).toBe(true);
    expect(hasPermission("administrator", "audit:read")).toBe(true);
    expect(hasPermission("administrator", "reclaim:admin")).toBe(true);
  });

  it("faculty can manage attendance and marks", () => {
    expect(hasPermission("faculty", "attendance:write")).toBe(true);
    expect(hasPermission("faculty", "marks:write")).toBe(true);
    expect(hasPermission("faculty", "students:delete")).toBe(false);
    expect(hasPermission("faculty", "audit:read")).toBe(false);
  });

  it("student has read-only access", () => {
    expect(hasPermission("student", "attendance:read")).toBe(true);
    expect(hasPermission("student", "marks:read")).toBe(true);
    expect(hasPermission("student", "reclaim:write")).toBe(true);
    expect(hasPermission("student", "attendance:write")).toBe(false);
    expect(hasPermission("student", "notices:write")).toBe(false);
  });

  it("returns correct permission list for roles", () => {
    const facultyPerms = getRolePermissions("faculty");
    expect(facultyPerms).toContain("attendance:write");
    expect(facultyPerms).not.toContain("audit:read");
  });
});
