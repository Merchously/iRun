import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const userInterests = pgTable("user_interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  interest: text("interest").notNull(), // "marathon", "trail", "nutrition", "gear", etc.
  source: text("source").notNull().default("onboarding"), // "onboarding" | "behaviour" | "explicit"
  weight: integer("weight").notNull().default(1), // 1-10, higher = stronger signal
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
