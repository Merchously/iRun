import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Races, fun runs, and running clinics across Canada.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Events</h1>
      <p className="mt-2 text-muted-foreground">
        Races, fun runs, and running clinics near you.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Events listing coming in Phase 1.
      </div>
    </div>
  );
}
