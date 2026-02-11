"use server";

import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { headers } from "next/headers";

export async function logAction(
  userId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  await db.insert(auditLogs).values({
    userId,
    action,
    entityType: entityType ?? null,
    entityId: entityId ?? null,
    metadata: metadata ?? null,
    ipAddress,
  });
}
