import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run Clubs",
  description: "Find run clubs across Canada.",
};

export default function ClubsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Run Clubs</h1>
      <p className="mt-2 text-muted-foreground">
        Find a run club near you, organised by city and vibe.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Run clubs directory coming in Phase 1.
      </div>
    </div>
  );
}
