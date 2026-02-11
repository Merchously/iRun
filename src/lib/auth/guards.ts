import { validateSession } from "./session";
import { db } from "@/lib/db";
import { userRoles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions/check";
import type { Permission, Role } from "@/types/permissions";

export async function requireAuth() {
  const result = await validateSession();
  if (!result) {
    redirect("/login");
  }

  const roles = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.userId, result.user.id));

  return {
    user: result.user,
    session: result.session,
    roles: roles.map((r) => r.role) as Role[],
  };
}

export async function requirePermission(permission: Permission) {
  const auth = await requireAuth();
  if (!hasPermission(auth.roles, permission)) {
    redirect("/");
  }
  return auth;
}

export async function requireRole(role: Role) {
  const auth = await requireAuth();
  if (!auth.roles.includes(role)) {
    redirect("/");
  }
  return auth;
}
