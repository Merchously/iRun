import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { events } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Updates existing events with location-specific Unsplash images
 * and new weather fields (humidity, wind, altitude).
 */
async function updateEvents() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("Updating events with images and weather data...");

  const updates: Record<
    string,
    {
      heroImageUrl: string;
      thumbnailUrl: string;
      avgHumidityPercent: number;
      avgWindKmh: number;
      altitudeMetres: number;
    }
  > = {
    "vancouver-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=640&h=400&fit=crop",
      avgHumidityPercent: 72,
      avgWindKmh: 15,
      altitudeMetres: 5,
    },
    "ottawa-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1569071668498-12e5c7e77a39?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1569071668498-12e5c7e77a39?w=640&h=400&fit=crop",
      avgHumidityPercent: 65,
      avgWindKmh: 18,
      altitudeMetres: 70,
    },
    "toronto-waterfront-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1517090504332-af2bd773a632?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1517090504332-af2bd773a632?w=640&h=400&fit=crop",
      avgHumidityPercent: 68,
      avgWindKmh: 20,
      altitudeMetres: 76,
    },
    "banff-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=640&h=400&fit=crop",
      avgHumidityPercent: 45,
      avgWindKmh: 12,
      altitudeMetres: 1383,
    },
    "whistler-alpine-meadows-ultra": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1565071783280-ab62e20bd2a2?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1565071783280-ab62e20bd2a2?w=640&h=400&fit=crop",
      avgHumidityPercent: 70,
      avgWindKmh: 10,
      altitudeMetres: 670,
    },
    "montreal-marathon-oasis": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=640&h=400&fit=crop",
      avgHumidityPercent: 70,
      avgWindKmh: 16,
      altitudeMetres: 36,
    },
    "calgary-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1571601035754-5c5b4e76d222?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1571601035754-5c5b4e76d222?w=640&h=400&fit=crop",
      avgHumidityPercent: 40,
      avgWindKmh: 22,
      altitudeMetres: 1045,
    },
    "squamish-50": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&h=400&fit=crop",
      avgHumidityPercent: 55,
      avgWindKmh: 8,
      altitudeMetres: 59,
    },
    "blue-nose-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1591456983933-0c4f7946bbe6?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1591456983933-0c4f7946bbe6?w=640&h=400&fit=crop",
      avgHumidityPercent: 78,
      avgWindKmh: 25,
      altitudeMetres: 20,
    },
    "sinister-7-ultra": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=640&h=400&fit=crop",
      avgHumidityPercent: 42,
      avgWindKmh: 14,
      altitudeMetres: 1340,
    },
    "mec-toronto-race-spring": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=640&h=400&fit=crop",
      avgHumidityPercent: 62,
      avgWindKmh: 18,
      altitudeMetres: 76,
    },
    "victoria-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1535096969533-ab9fe41653f1?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1535096969533-ab9fe41653f1?w=640&h=400&fit=crop",
      avgHumidityPercent: 75,
      avgWindKmh: 15,
      altitudeMetres: 20,
    },
    "quebec-city-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1558369553-4b90dc7261c5?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1558369553-4b90dc7261c5?w=640&h=400&fit=crop",
      avgHumidityPercent: 72,
      avgWindKmh: 16,
      altitudeMetres: 74,
    },
    "hatley-park-trail-run": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640&h=400&fit=crop",
      avgHumidityPercent: 65,
      avgWindKmh: 10,
      altitudeMetres: 30,
    },
    "mississauga-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1507992781348-310259076fe0?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1507992781348-310259076fe0?w=640&h=400&fit=crop",
      avgHumidityPercent: 65,
      avgWindKmh: 18,
      altitudeMetres: 84,
    },
    "elk-island-ultra": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=640&h=400&fit=crop",
      avgHumidityPercent: 55,
      avgWindKmh: 14,
      altitudeMetres: 720,
    },
    "around-the-bay-30k": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1570709334602-2aa11efb2e29?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1570709334602-2aa11efb2e29?w=640&h=400&fit=crop",
      avgHumidityPercent: 70,
      avgWindKmh: 22,
      altitudeMetres: 85,
    },
    "winnipeg-police-half-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1611430916914-e2bfcbc2f8b8?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611430916914-e2bfcbc2f8b8?w=640&h=400&fit=crop",
      avgHumidityPercent: 60,
      avgWindKmh: 24,
      altitudeMetres: 232,
    },
    "fredericton-marathon": {
      heroImageUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=800&fit=crop",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=640&h=400&fit=crop",
      avgHumidityPercent: 68,
      avgWindKmh: 14,
      altitudeMetres: 10,
    },
  };

  for (const [slug, data] of Object.entries(updates)) {
    await db
      .update(events)
      .set({
        heroImageUrl: data.heroImageUrl,
        thumbnailUrl: data.thumbnailUrl,
        avgHumidityPercent: data.avgHumidityPercent,
        avgWindKmh: data.avgWindKmh,
        altitudeMetres: data.altitudeMetres,
        updatedAt: new Date(),
      })
      .where(eq(events.slug, slug));
    console.log(`  Updated: ${slug}`);
  }

  console.log("Event updates complete!");

  await client.end();
  process.exit(0);
}

updateEvents().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
