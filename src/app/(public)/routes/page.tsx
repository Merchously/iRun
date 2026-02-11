import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Routes",
  description: "Discover running routes across Canada.",
};

export default function RoutesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
      <p className="mt-2 text-muted-foreground">
        Discover running routes by city, distance, and surface type.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Routes coming in Phase 3.
      </div>
    </div>
  );
}
