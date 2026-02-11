import { pgEnum, pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const roleEnum = pgEnum("role", [
  "admin",
  "editor",
  "contributor",
  "support",
  "commerce_ops",
  "partner",
  "runner",
]);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
    assignedBy: uuid("assigned_by").references(() => users.id),
  },
  (table) => [unique().on(table.userId, table.role)]
);
