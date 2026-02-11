import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
      <p className="mt-1 text-muted-foreground">
        Content performance, store metrics, support volume, and community growth.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Analytics dashboard coming in Phase 5.
      </div>
    </div>
  );
}
