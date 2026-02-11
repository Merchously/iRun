import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  doublePrecision,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  eventType: text("event_type").notNull().default("race"), // race | fun_run | clinic | relay | virtual
  status: text("status").notNull().default("draft"), // draft | published | cancelled | completed

  // Dates
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  registrationDeadline: timestamp("registration_deadline", {
    withTimezone: true,
  }),

  // Location
  city: text("city").notNull(),
  province: text("province").notNull(),
  country: text("country").notNull().default("CA"),
  venue: text("venue"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),

  // Content
  description: text("description"),
  shortDescription: text("short_description"),
  heroImageUrl: text("hero_image_url"),
  thumbnailUrl: text("thumbnail_url"),

  // Course data
  terrain: text("terrain"), // road | trail | mixed | track
  elevationGainMetres: integer("elevation_gain_metres"),
  elevationProfile: jsonb("elevation_profile").$type<
    { distance: number; elevation: number }[]
  >(),
  courseDescription: text("course_description"),

  // Weather (historical averages)
  avgTemperatureCelsius: integer("avg_temperature_celsius"),
  avgPrecipitationMm: integer("avg_precipitation_mm"),
  avgHumidityPercent: integer("avg_humidity_percent"),
  avgWindKmh: integer("avg_wind_kmh"),
  altitudeMetres: integer("altitude_metres"),
  weatherNotes: text("weather_notes"),

  // Pricing
  priceFromCad: integer("price_from_cad"), // in cents
  priceToCad: integer("price_to_cad"),
  currency: text("currency").notNull().default("CAD"),

  // Links
  registrationUrl: text("registration_url"),
  websiteUrl: text("website_url"),
  resultsUrl: text("results_url"),

  // Tags & amenities (denormalized for fast filtering)
  tags: jsonb("tags").$type<string[]>(),
  amenities: jsonb("amenities").$type<string[]>(),

  // Organizer
  organizerName: text("organizer_name"),
  organizerId: uuid("organizer_id").references(() => users.id),

  // Meta
  featured: boolean("featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const eventDistances = pgTable("event_distances", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  distance: text("distance").notNull(), // 5k | 10k | half | marathon | ultra | custom
  distanceKm: doublePrecision("distance_km"),
  distanceLabel: text("distance_label"),
  priceCad: integer("price_cad"), // in cents
  capacity: integer("capacity"),
  registrationUrl: text("registration_url"),
  cutoffTime: text("cutoff_time"),
});

export const eventRsvps = pgTable(
  "event_rsvps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    distanceId: uuid("distance_id").references(() => eventDistances.id),
    status: text("status").notNull().default("interested"), // interested | registered | completed | dns
    resultTime: text("result_time"),
    resultPlacement: integer("result_placement"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.userId, table.eventId)]
);
