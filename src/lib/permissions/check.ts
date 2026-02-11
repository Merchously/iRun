import { ROLE_PERMISSIONS } from "./roles";
import type { Role, Permission } from "@/types/permissions";

export function hasPermission(
  userRoles: Role[],
  permission: Permission
): boolean {
  return userRoles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

export function hasAnyPermission(
  userRoles: Role[],
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(userRoles, p));
}

export function hasRole(userRoles: Role[], role: Role): boolean {
  return userRoles.includes(role);
}

export function isStaff(userRoles: Role[]): boolean {
  const staffRoles: Role[] = [
    "admin",
    "editor",
    "contributor",
    "support",
    "commerce_ops",
  ];
  return userRoles.some((r) => staffRoles.includes(r));
}
