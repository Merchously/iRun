"use server";

import { db } from "@/lib/db";
import { users, userRoles } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  invalidateSession,
  validateSession,
} from "@/lib/auth/session";
import { logAction } from "./audit";
import { loginSchema, registerSchema } from "@/lib/validators/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function register(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });

  if (!parsed.success) {
    return { error: "Please check your input and try again." };
  }

  const { email, password, displayName } = parsed.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      displayName,
    })
    .returning();

  await db.insert(userRoles).values({
    userId: newUser.id,
    role: "runner",
  });

  await createSession(newUser.id);
  await logAction(newUser.id, "user.register", "user", newUser.id);

  redirect("/account");
}

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please check your input and try again." };
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  await logAction(user.id, "user.login", "user", user.id);

  redirect("/account");
}

export async function logout() {
  const result = await validateSession();
  if (result) {
    await logAction(result.user.id, "user.logout", "user", result.user.id);
    await invalidateSession(result.session.id);
  }
  redirect("/login");
}
