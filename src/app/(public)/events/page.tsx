import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  getPublishedEvents,
  getFeaturedEvents,
  getUpcomingEvents,
  getEventsByCategory,
} from "@/lib/queries/events";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { EmptyState } from "@/components/ui/empty-state";
import type { EventFilters as EventFiltersType } from "@/lib/validators/events";

export const metadata: Metadata = {
  title: "Races & Events",
  description: "Discover running races, fun runs, and clinics across Canada.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasFilters =
    params.distances || params.terrain || params.province || params.city;

  if (hasFilters) {
    return <FilteredView params={params} />;
  }

  return <BrowseView />;
}

async function BrowseView() {
  const [featured, upcoming, trail] = await Promise.all([
    getFeaturedEvents(6),
    getUpcomingEvents(8),
    getEventsByCategory("trail", 6),
  ]);

  const hasAnyEvents =
    featured.length > 0 || upcoming.length > 0 || trail.length > 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-5 pb-8 pt-28 md:px-12 md:pb-12 md:pt-36 lg:px-20">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Find Your Next Race
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Discover running races, fun runs, and clinics across Canada.
        </p>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 border-b border-border bg-background/95 px-5 py-4 backdrop-blur-md md:px-12 lg:px-20">
        <Suspense>
          <EventFilters />
        </Suspense>
      </section>

      {!hasAnyEvents ? (
        <section className="px-5 py-20 md:px-12 lg:px-20">
          <EmptyState
            title="No races yet"
            description="Check back soon — we're adding Canadian races every day."
          />
        </section>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <EventCarouselSection
              title="Featured Races"
              subtitle="Editorially curated events"
              events={featured}
            />
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <EventCarouselSection
              title="Upcoming Events"
              subtitle="Coming up next across Canada"
              events={upcoming}
            />
          )}

          {/* Trail */}
          {trail.length > 0 && (
            <EventCarouselSection
              title="Trail Races"
              subtitle="Hit the trails"
              events={trail}
            />
          )}
        </>
      )}
    </div>
  );
}

async function FilteredView({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters: EventFiltersType = {
    distances: params.distances?.split(",") as EventFiltersType["distances"],
    terrain: params.terrain?.split(",") as EventFiltersType["terrain"],
    province: params.province,
    city: params.city,
    sort: (params.sort as EventFiltersType["sort"]) || "date",
    page: params.page ? parseInt(params.page) : 1,
    limit: 20,
  };

  const result = await getPublishedEvents(filters);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-5 pb-8 pt-28 md:px-12 md:pb-12 md:pt-36 lg:px-20">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Find Your Next Race
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          {result.total} race{result.total !== 1 ? "s" : ""} found
        </p>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 border-b border-border bg-background/95 px-5 py-4 backdrop-blur-md md:px-12 lg:px-20">
        <Suspense>
          <EventFilters />
        </Suspense>
      </section>

      {/* Grid results */}
      <section className="px-5 py-10 md:px-12 md:py-16 lg:px-20">
        {result.events.length === 0 ? (
          <EmptyState
            title="No races match your filters"
            description="Try adjusting your filters or clearing them to see all races."
            action={
              <Link
                href="/events"
                className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Clear filters
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.events.map((event) => (
                <EventCard
                  key={event.id}
                  slug={event.slug}
                  name={event.name}
                  startDate={event.startDate}
                  city={event.city}
                  province={event.province}
                  terrain={event.terrain}
                  heroImageUrl={event.heroImageUrl}
                  thumbnailUrl={event.thumbnailUrl}
                  priceFromCad={event.priceFromCad}
                  distances={event.distances}
                />
              ))}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                {result.page > 1 && (
                  <Link
                    href={`/events?${buildPageParams(params, result.page - 1)}`}
                    className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted"
                  >
                    Previous
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  Page {result.page} of {result.totalPages}
                </span>
                {result.page < result.totalPages && (
                  <Link
                    href={`/events?${buildPageParams(params, result.page + 1)}`}
                    className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function EventCarouselSection({
  title,
  subtitle,
  events,
}: {
  title: string;
  subtitle: string;
  events: Awaited<ReturnType<typeof getFeaturedEvents>>;
}) {
  return (
    <section className="px-5 py-10 first:pt-12 md:px-12 md:py-16 lg:px-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="scrollbar-hide mt-6 flex gap-4 overflow-x-auto md:mt-8 md:gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            slug={event.slug}
            name={event.name}
            startDate={event.startDate}
            city={event.city}
            province={event.province}
            terrain={event.terrain}
            heroImageUrl={event.heroImageUrl}
            thumbnailUrl={event.thumbnailUrl}
            priceFromCad={event.priceFromCad}
            distances={event.distances}
          />
        ))}
      </div>
    </section>
  );
}

function buildPageParams(
  params: Record<string, string | undefined>,
  page: number
) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  sp.set("page", String(page));
  return sp.toString();
}
