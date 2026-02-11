"use server";

import { db } from "@/lib/db";
import { events, eventDistances, eventRsvps } from "@/lib/db/schema";
import { requireAuth, requirePermission } from "@/lib/auth/guards";
import { logAction } from "./audit";
import {
  createEventSchema,
  updateEventSchema,
  createDistanceSchema,
} from "@/lib/validators/events";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createEvent(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requirePermission("event.create");

  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "distances") continue; // handled separately
    raw[key] = value === "" ? undefined : value;
  }

  const parsed = createEventSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.format()).find(
      (v) => v && typeof v === "object" && "_errors" in v
    );
    const message =
      firstError && "_errors" in firstError
        ? (firstError._errors as string[])[0]
        : "Please check your input.";
    return { error: message };
  }

  const [newEvent] = await db
    .insert(events)
    .values({
      ...parsed.data,
      heroImageUrl: parsed.data.heroImageUrl || null,
      thumbnailUrl: parsed.data.thumbnailUrl || null,
      registrationUrl: parsed.data.registrationUrl || null,
      websiteUrl: parsed.data.websiteUrl || null,
      resultsUrl: parsed.data.resultsUrl || null,
      createdBy: auth.user.id,
    })
    .returning();

  // Parse distances from formData
  const distancesJson = formData.get("distances");
  if (distancesJson && typeof distancesJson === "string") {
    try {
      const distancesArr = JSON.parse(distancesJson) as Record<
        string,
        unknown
      >[];
      for (const d of distancesArr) {
        const dparsed = createDistanceSchema.safeParse(d);
        if (dparsed.success) {
          await db.insert(eventDistances).values({
            eventId: newEvent.id,
            ...dparsed.data,
            registrationUrl: dparsed.data.registrationUrl || null,
          });
        }
      }
    } catch {
      // ignore malformed distances JSON
    }
  }

  await logAction(
    auth.user.id,
    "event.create",
    "event",
    newEvent.id,
    { name: newEvent.name }
  );

  redirect("/admin/events");
}

export async function updateEvent(
  eventId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requirePermission("event.edit_any");

  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "distances") continue;
    raw[key] = value === "" ? undefined : value;
  }

  const parsed = updateEventSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Please check your input." };
  }

  await db
    .update(events)
    .set({
      ...parsed.data,
      heroImageUrl: parsed.data.heroImageUrl || null,
      thumbnailUrl: parsed.data.thumbnailUrl || null,
      registrationUrl: parsed.data.registrationUrl || null,
      websiteUrl: parsed.data.websiteUrl || null,
      resultsUrl: parsed.data.resultsUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(events.id, eventId));

  // Replace distances
  const distancesJson = formData.get("distances");
  if (distancesJson && typeof distancesJson === "string") {
    try {
      await db
        .delete(eventDistances)
        .where(eq(eventDistances.eventId, eventId));

      const distancesArr = JSON.parse(distancesJson) as Record<
        string,
        unknown
      >[];
      for (const d of distancesArr) {
        const dparsed = createDistanceSchema.safeParse(d);
        if (dparsed.success) {
          await db.insert(eventDistances).values({
            eventId,
            ...dparsed.data,
            registrationUrl: dparsed.data.registrationUrl || null,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  await logAction(auth.user.id, "event.update", "event", eventId);

  redirect("/admin/events");
}

export async function publishEvent(eventId: string) {
  const auth = await requirePermission("event.publish");

  await db
    .update(events)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(events.id, eventId));

  await logAction(auth.user.id, "event.publish", "event", eventId);
}

export async function unpublishEvent(eventId: string) {
  const auth = await requirePermission("event.publish");

  await db
    .update(events)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(events.id, eventId));

  await logAction(auth.user.id, "event.unpublish", "event", eventId);
}

export async function deleteEvent(eventId: string) {
  const auth = await requirePermission("event.delete");

  await db.delete(events).where(eq(events.id, eventId));

  await logAction(auth.user.id, "event.delete", "event", eventId);
  redirect("/admin/events");
}

export async function toggleRsvp(eventId: string) {
  const auth = await requireAuth();

  const existing = await db
    .select()
    .from(eventRsvps)
    .where(
      and(
        eq(eventRsvps.userId, auth.user.id),
        eq(eventRsvps.eventId, eventId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(eventRsvps)
      .where(eq(eventRsvps.id, existing[0].id));
    return { saved: false };
  }

  await db.insert(eventRsvps).values({
    userId: auth.user.id,
    eventId,
    status: "interested",
  });

  return { saved: true };
}
