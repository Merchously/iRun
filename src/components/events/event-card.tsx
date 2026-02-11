import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  slug: string;
  name: string;
  startDate: Date;
  city: string;
  province: string;
  terrain?: string | null;
  heroImageUrl?: string | null;
  thumbnailUrl?: string | null;
  priceFromCad?: number | null;
  distances: { distance: string; distanceLabel?: string | null }[];
}

const distanceLabels: Record<string, string> = {
  "5k": "5K",
  "10k": "10K",
  half: "Half Marathon",
  marathon: "Marathon",
  ultra: "Ultra",
  custom: "Custom",
};

export function EventCard({
  slug,
  name,
  startDate,
  city,
  province,
  terrain,
  heroImageUrl,
  thumbnailUrl,
  priceFromCad,
  distances,
}: EventCardProps) {
  const imageUrl =
    thumbnailUrl ||
    heroImageUrl ||
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=640&h=400&fit=crop";

  const formattedDate = new Date(startDate).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${slug}`}
      className="group block w-72 flex-none md:w-80"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="overflow-hidden rounded-2xl bg-card transition-transform duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {terrain && (
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium capitalize text-white backdrop-blur-sm">
              {terrain}
            </span>
          )}
        </div>
        <div className="p-4 md:p-5">
          <h3 className="font-semibold leading-snug group-hover:text-primary">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formattedDate} &middot; {city}, {province}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {distances.map((d) => (
              <Badge key={d.distance} variant="muted">
                {d.distanceLabel || distanceLabels[d.distance] || d.distance}
              </Badge>
            ))}
            {priceFromCad != null && (
              <span className="ml-auto text-xs font-medium text-muted-foreground">
                from ${(priceFromCad / 100).toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
