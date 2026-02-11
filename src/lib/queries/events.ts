import { db } from "@/lib/db";
import { events, eventDistances, eventRsvps } from "@/lib/db/schema";
import { eq, and, gte, lte, ilike, desc, asc, sql, inArray } from "drizzle-orm";
import type { EventFilters } from "@/lib/validators/events";

export async function getPublishedEvents(filters: EventFilters) {
  const conditions = [eq(events.status, "published")];

  if (filters.province) {
    conditions.push(eq(events.province, filters.province));
  }

  if (filters.city) {
    conditions.push(ilike(events.city, `%${filters.city}%`));
  }

  if (filters.dateFrom) {
    conditions.push(gte(events.startDate, filters.dateFrom));
  }

  if (filters.dateTo) {
    conditions.push(lte(events.startDate, filters.dateTo));
  }

  if (filters.priceMax !== undefined) {
    conditions.push(lte(events.priceFromCad, filters.priceMax));
  }

  if (filters.featured) {
    conditions.push(eq(events.featured, true));
  }

  // Terrain filter
  if (filters.terrain && filters.terrain.length > 0) {
    conditions.push(inArray(events.terrain, filters.terrain));
  }

  const orderBy =
    filters.sort === "price"
      ? asc(events.priceFromCad)
      : filters.sort === "popular"
        ? desc(events.viewCount)
        : asc(events.startDate);

  const offset = (filters.page - 1) * filters.limit;

  const [eventRows, countResult] = await Promise.all([
    db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(filters.limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(and(...conditions)),
  ]);

  // Fetch distances for these events
  const eventIds = eventRows.map((e) => e.id);
  const distances =
    eventIds.length > 0
      ? await db
          .select()
          .from(eventDistances)
          .where(inArray(eventDistances.eventId, eventIds))
      : [];

  // Group distances by event
  const distancesByEvent = new Map<string, typeof distances>();
  for (const d of distances) {
    const existing = distancesByEvent.get(d.eventId) || [];
    existing.push(d);
    distancesByEvent.set(d.eventId, existing);
  }

  // Filter by distance categories if specified
  let filteredEvents = eventRows;
  if (filters.distances && filters.distances.length > 0) {
    const targetDistances = new Set<string>(filters.distances);
    filteredEvents = eventRows.filter((e) => {
      const dists = distancesByEvent.get(e.id) || [];
      return dists.some((d) => targetDistances.has(d.distance));
    });
  }

  return {
    events: filteredEvents.map((e) => ({
      ...e,
      distances: distancesByEvent.get(e.id) || [],
    })),
    total: countResult[0]?.count ?? 0,
    page: filters.page,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / filters.limit),
  };
}

export async function getEventBySlug(slug: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!event) return null;

  const distances = await db
    .select()
    .from(eventDistances)
    .where(eq(eventDistances.eventId, event.id));

  return { ...event, distances };
}

export async function getFeaturedEvents(limit = 6) {
  const rows = await db
    .select()
    .from(events)
    .where(and(eq(events.status, "published"), eq(events.featured, true)))
    .orderBy(asc(events.startDate))
    .limit(limit);

  const eventIds = rows.map((e) => e.id);
  const distances =
    eventIds.length > 0
      ? await db
          .select()
          .from(eventDistances)
          .where(inArray(eventDistances.eventId, eventIds))
      : [];

  const distancesByEvent = new Map<string, typeof distances>();
  for (const d of distances) {
    const existing = distancesByEvent.get(d.eventId) || [];
    existing.push(d);
    distancesByEvent.set(d.eventId, existing);
  }

  return rows.map((e) => ({
    ...e,
    distances: distancesByEvent.get(e.id) || [],
  }));
}

export async function getUpcomingEvents(limit = 6) {
  const rows = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        gte(events.startDate, new Date())
      )
    )
    .orderBy(asc(events.startDate))
    .limit(limit);

  const eventIds = rows.map((e) => e.id);
  const distances =
    eventIds.length > 0
      ? await db
          .select()
          .from(eventDistances)
          .where(inArray(eventDistances.eventId, eventIds))
      : [];

  const distancesByEvent = new Map<string, typeof distances>();
  for (const d of distances) {
    const existing = distancesByEvent.get(d.eventId) || [];
    existing.push(d);
    distancesByEvent.set(d.eventId, existing);
  }

  return rows.map((e) => ({
    ...e,
    distances: distancesByEvent.get(e.id) || [],
  }));
}

export async function getEventsByCategory(
  terrain: string,
  limit = 6
) {
  const rows = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "published"),
        eq(events.terrain, terrain),
        gte(events.startDate, new Date())
      )
    )
    .orderBy(asc(events.startDate))
    .limit(limit);

  const eventIds = rows.map((e) => e.id);
  const distances =
    eventIds.length > 0
      ? await db
          .select()
          .from(eventDistances)
          .where(inArray(eventDistances.eventId, eventIds))
      : [];

  const distancesByEvent = new Map<string, typeof distances>();
  for (const d of distances) {
    const existing = distancesByEvent.get(d.eventId) || [];
    existing.push(d);
    distancesByEvent.set(d.eventId, existing);
  }

  return rows.map((e) => ({
    ...e,
    distances: distancesByEvent.get(e.id) || [],
  }));
}

export async function getUserRsvp(userId: string, eventId: string) {
  const [rsvp] = await db
    .select()
    .from(eventRsvps)
    .where(
      and(eq(eventRsvps.userId, userId), eq(eventRsvps.eventId, eventId))
    )
    .limit(1);
  return rsvp ?? null;
}

export async function getEventById(id: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (!event) return null;

  const dists = await db
    .select()
    .from(eventDistances)
    .where(eq(eventDistances.eventId, event.id));

  return { ...event, distances: dists };
}

export async function getAllEvents() {
  return db.select().from(events).orderBy(desc(events.createdAt));
}

export async function incrementViewCount(eventId: string) {
  await db
    .update(events)
    .set({ viewCount: sql`${events.viewCount} + 1` })
    .where(eq(events.id, eventId));
}
