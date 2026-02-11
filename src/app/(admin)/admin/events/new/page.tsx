import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/guards";
import { createEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/events/event-form";

export const metadata: Metadata = { title: "New Event | iRun OS" };

export default async function NewEventPage() {
  await requirePermission("event.create");

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
      <p className="mt-1 text-muted-foreground">
        Add a new race or event to the platform.
      </p>
      <div className="mt-6">
        <EventForm action={createEvent} submitLabel="Create Event" />
      </div>
    </div>
  );
}
