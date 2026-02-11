import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, incrementViewCount } from "@/lib/queries/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EventInfoCards } from "@/components/events/event-info-cards";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.name,
    description:
      event.shortDescription || `${event.name} in ${event.city}, ${event.province}`,
  };
}

const distanceLabels: Record<string, string> = {
  "5k": "5K",
  "10k": "10K",
  half: "Half Marathon",
  marathon: "Marathon",
  ultra: "Ultra",
  custom: "Custom",
};

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status === "draft") {
    notFound();
  }

  // Fire and forget view count
  incrementViewCount(event.id).catch(() => {});

  const heroImage =
    event.heroImageUrl ||
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&h=800&fit=crop";

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96">
        <Image
          src={heroImage}
          alt={event.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-12 lg:px-20">
          <div className="flex flex-wrap items-center gap-2">
            {event.terrain && (
              <Badge variant="primary" className="capitalize">
                {event.terrain}
              </Badge>
            )}
            {event.eventType !== "race" && (
              <Badge variant="outline" className="border-white/30 text-white capitalize">
                {event.eventType.replace("_", " ")}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            {event.name}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-12 md:py-16 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Key info */}
            <div className="grid gap-6 sm:grid-cols-3">
              <InfoBlock label="Date" value={formattedDate} />
              <InfoBlock
                label="Location"
                value={`${event.city}, ${event.province}`}
              />
              {event.priceFromCad != null && (
                <InfoBlock
                  label="Price"
                  value={
                    event.priceToCad && event.priceToCad !== event.priceFromCad
                      ? `$${(event.priceFromCad / 100).toFixed(0)} – $${(event.priceToCad / 100).toFixed(0)} CAD`
                      : `$${(event.priceFromCad / 100).toFixed(0)} CAD`
                  }
                />
              )}
            </div>

            {/* Race info cards with animations */}
            <div className="mt-8">
              <EventInfoCards
                terrain={event.terrain}
                priceFromCad={event.priceFromCad}
                priceToCad={event.priceToCad}
                elevationGainMetres={event.elevationGainMetres}
                avgTemperatureCelsius={event.avgTemperatureCelsius}
                avgHumidityPercent={event.avgHumidityPercent}
                avgWindKmh={event.avgWindKmh}
                altitudeMetres={event.altitudeMetres}
                weatherNotes={event.weatherNotes}
              />
            </div>

            {/* Distances */}
            {event.distances.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold">Distances</h2>
                <div className="mt-4 space-y-3">
                  {event.distances.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-xl border border-border p-4"
                    >
                      <div>
                        <span className="font-medium">
                          {d.distanceLabel ||
                            distanceLabels[d.distance] ||
                            d.distance}
                        </span>
                        {d.distanceKm && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {d.distanceKm} km
                          </span>
                        )}
                        {d.cutoffTime && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            Cutoff: {d.cutoffTime}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {d.priceCad != null && (
                          <span className="font-medium">
                            ${(d.priceCad / 100).toFixed(0)} CAD
                          </span>
                        )}
                        {d.capacity && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({d.capacity} spots)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-10" />

            {/* Description */}
            {event.description && (
              <div>
                <h2 className="text-xl font-semibold">About This Event</h2>
                <div className="prose mt-4 max-w-none text-foreground/90">
                  {event.description.split("\n").map((p, i) => (
                    <p key={i} className="mb-3 leading-relaxed font-body">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Course */}
            {event.courseDescription && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold">Course</h2>
                <p className="mt-3 leading-relaxed text-foreground/80 font-body">
                  {event.courseDescription}
                </p>
                {event.elevationGainMetres != null && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Elevation gain: {event.elevationGainMetres}m
                  </p>
                )}
              </div>
            )}


            {/* Tags & amenities */}
            {event.tags && event.tags.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-semibold">Tags</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="capitalize">
                      {tag.replace(/-/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {event.amenities && event.amenities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.amenities.map((amenity) => (
                    <Badge key={amenity} variant="muted" className="capitalize">
                      {amenity.replace(/-/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
              <p className="mt-1 font-medium">
                {event.city}, {event.province}
              </p>

              {event.priceFromCad != null && (
                <p className="mt-4 text-2xl font-semibold">
                  {event.priceToCad && event.priceToCad !== event.priceFromCad
                    ? `$${(event.priceFromCad / 100).toFixed(0)} – $${(event.priceToCad / 100).toFixed(0)}`
                    : `$${(event.priceFromCad / 100).toFixed(0)}`}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    CAD
                  </span>
                </p>
              )}

              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block"
                >
                  <Button size="lg" className="w-full">
                    Register Now
                  </Button>
                </a>
              )}

              {event.websiteUrl && (
                <a
                  href={event.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center text-sm text-primary hover:underline"
                >
                  Visit event website
                </a>
              )}

              {event.organizerName && (
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">Organized by</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {event.organizerName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
