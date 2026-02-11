import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/guards";
import { getAllEvents } from "@/lib/queries/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Events | iRun OS" };

const statusVariant: Record<string, "default" | "primary" | "destructive" | "muted"> = {
  draft: "muted",
  published: "primary",
  cancelled: "destructive",
  completed: "default",
};

export default async function AdminEventsPage() {
  await requirePermission("event.create");
  const events = await getAllEvents();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="mt-1 text-muted-foreground">
            {events.length} event{events.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button>+ New Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
          No events yet. Create your first event to get started.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Views</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30">
                  <td className="py-3 pr-4">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        /{event.slug}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {event.city}, {event.province}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant[event.status] || "default"}>
                      {event.status}
                    </Badge>
                    {event.featured && (
                      <Badge variant="outline" className="ml-1">
                        featured
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {event.viewCount}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    {event.status === "published" && (
                      <Link
                        href={`/events/${event.slug}`}
                        className="ml-3 text-muted-foreground hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
