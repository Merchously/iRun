import type { Metadata } from "next";

export const metadata: Metadata = { title: "Commerce" };

export default function CommercePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Commerce</h1>
      <p className="mt-1 text-muted-foreground">
        Orders, refunds, size replacements, and promotions.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Commerce operations coming in Phase 2.
      </div>
    </div>
  );
}
