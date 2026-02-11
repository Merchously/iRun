import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Support</h1>
      <p className="mt-1 text-muted-foreground">
        Ticket management, macros, and SLA tracking.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Support desk coming in Phase 2.
      </div>
    </div>
  );
}
