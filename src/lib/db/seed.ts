import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, userRoles } from "./schema";
import { hashPassword } from "../auth/password";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("Seeding database...");

  const passwordHash = await hashPassword("CHANGE_ME_IMMEDIATELY");

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@irun.ca",
      passwordHash,
      displayName: "iRun Admin",
      emailVerified: true,
    })
    .returning();

  await db.insert(userRoles).values({
    userId: admin.id,
    role: "admin",
  });

  console.log("Seed complete. Admin user created: admin@irun.ca");

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
