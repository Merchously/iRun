import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editorial" };

export default function EditorialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Editorial</h1>
      <p className="mt-1 text-muted-foreground">
        Pitch intake, assignments, editorial calendar, and publishing.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Editorial operations coming in Phase 1.
      </div>
    </div>
  );
}
