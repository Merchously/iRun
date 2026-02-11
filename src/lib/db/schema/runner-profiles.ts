import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const runnerProfiles = pgTable("runner_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  goalDistance: text("goal_distance"), // "5k" | "10k" | "half" | "marathon" | "ultra"
  weeklyKilometres: integer("weekly_kilometres"),
  preferredDays: jsonb("preferred_days").$type<string[]>(), // ["monday", "wednesday", "saturday"]
  paceZones: jsonb("pace_zones").$type<Record<string, string>>(), // { easy: "6:30", tempo: "5:15" }
  surfacePreference: text("surface_preference"), // "road" | "trail" | "mixed"
  province: text("province"),
  city: text("city"),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  gender: text("gender"),
  injuryFlags: jsonb("injury_flags").$type<string[]>(), // private, never exposed publicly
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isPublic: boolean("is_public").notNull().default(false),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
