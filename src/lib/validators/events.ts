import { z } from "zod/v4";

export const eventTypes = [
  "race",
  "fun_run",
  "clinic",
  "relay",
  "virtual",
] as const;

export const eventStatuses = [
  "draft",
  "published",
  "cancelled",
  "completed",
] as const;

export const terrainTypes = ["road", "trail", "mixed", "track"] as const;

export const distanceCategories = [
  "5k",
  "10k",
  "half",
  "marathon",
  "ultra",
  "custom",
] as const;

export const createEventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a valid URL slug"),
  eventType: z.enum(eventTypes),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  registrationDeadline: z.coerce.date().optional(),
  city: z.string().min(1, "City is required").max(100),
  province: z.string().min(1, "Province is required").max(10),
  country: z.string().max(10).default("CA"),
  venue: z.string().max(200).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(200).optional(),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  terrain: z.enum(terrainTypes).optional(),
  elevationGainMetres: z.coerce.number().int().min(0).optional(),
  courseDescription: z.string().optional(),
  avgTemperatureCelsius: z.coerce.number().int().optional(),
  avgPrecipitationMm: z.coerce.number().int().min(0).optional(),
  weatherNotes: z.string().max(500).optional(),
  priceFromCad: z.coerce.number().int().min(0).optional(),
  priceToCad: z.coerce.number().int().min(0).optional(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  resultsUrl: z.string().url().optional().or(z.literal("")),
  organizerName: z.string().max(200).optional(),
  featured: z.coerce.boolean().default(false),
  status: z.enum(eventStatuses).default("draft"),
});

export const updateEventSchema = createEventSchema.partial();

export const createDistanceSchema = z.object({
  distance: z.enum(distanceCategories),
  distanceKm: z.coerce.number().positive().optional(),
  distanceLabel: z.string().max(100).optional(),
  priceCad: z.coerce.number().int().min(0).optional(),
  capacity: z.coerce.number().int().positive().optional(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  cutoffTime: z.string().max(20).optional(),
});

export const eventFiltersSchema = z.object({
  distances: z.array(z.enum(distanceCategories)).optional(),
  terrain: z.array(z.enum(terrainTypes)).optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["date", "price", "popular"]).default("date"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type EventFilters = z.infer<typeof eventFiltersSchema>;
