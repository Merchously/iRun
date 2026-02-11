import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "irun_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionId;
}

export async function validateSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const [result] = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!result || result.session.expiresAt < new Date()) {
    if (result) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
    return null;
  }

  // Sliding window: extend if past halfway
  const halfLife = SESSION_DURATION_MS / 2;
  if (result.session.expiresAt.getTime() - Date.now() < halfLife) {
    const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
    await db
      .update(sessions)
      .set({ expiresAt: newExpiry })
      .where(eq(sessions.id, sessionId));
  }

  return {
    user: result.user,
    session: result.session,
  };
}

export async function invalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
