import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guards";
import { getEventById } from "@/lib/queries/events";
import { updateEvent, publishEvent, unpublishEvent, deleteEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/events/event-form";
import { EventAdminActions } from "@/components/events/event-admin-actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? `Edit: ${event.name} | iRun OS` : "Event Not Found" };
}

export default async function EditEventPage({ params }: PageProps) {
  await requirePermission("event.edit_any");
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const boundUpdate = updateEvent.bind(null, event.id);

  const formatDate = (d: Date | null | undefined) =>
    d ? new Date(d).toISOString().split("T")[0] : undefined;

  const initialData = {
    name: event.name,
    slug: event.slug,
    eventType: event.eventType,
    startDate: formatDate(event.startDate),
    endDate: formatDate(event.endDate),
    registrationDeadline: formatDate(event.registrationDeadline),
    city: event.city,
    province: event.province,
    country: event.country,
    venue: event.venue || undefined,
    latitude: event.latitude?.toString(),
    longitude: event.longitude?.toString(),
    description: event.description || undefined,
    shortDescription: event.shortDescription || undefined,
    heroImageUrl: event.heroImageUrl || undefined,
    thumbnailUrl: event.thumbnailUrl || undefined,
    terrain: event.terrain || undefined,
    elevationGainMetres: event.elevationGainMetres?.toString(),
    courseDescription: event.courseDescription || undefined,
    avgTemperatureCelsius: event.avgTemperatureCelsius?.toString(),
    avgPrecipitationMm: event.avgPrecipitationMm?.toString(),
    weatherNotes: event.weatherNotes || undefined,
    priceFromCad: event.priceFromCad?.toString(),
    priceToCad: event.priceToCad?.toString(),
    registrationUrl: event.registrationUrl || undefined,
    websiteUrl: event.websiteUrl || undefined,
    resultsUrl: event.resultsUrl || undefined,
    organizerName: event.organizerName || undefined,
    featured: event.featured,
    status: event.status,
  };

  const initialDistances = event.distances.map((d) => ({
    distance: d.distance,
    distanceKm: d.distanceKm?.toString(),
    distanceLabel: d.distanceLabel || undefined,
    priceCad: d.priceCad?.toString(),
    capacity: d.capacity?.toString(),
    cutoffTime: d.cutoffTime || undefined,
  }));

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit: {event.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            <Link
              href={`/events/${event.slug}`}
              className="text-primary hover:underline"
              target="_blank"
            >
              View public page
            </Link>
          </p>
        </div>
        <EventAdminActions
          eventId={event.id}
          status={event.status}
          publishAction={publishEvent}
          unpublishAction={unpublishEvent}
          deleteAction={deleteEvent}
        />
      </div>
      <div className="mt-6">
        <EventForm
          action={boundUpdate}
          initialData={initialData}
          initialDistances={initialDistances}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
