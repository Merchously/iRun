import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Made-to-order iRun merchandise.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
      <p className="mt-2 text-muted-foreground">
        Made-to-order iRun merchandise with fit guidance.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Shop coming in Phase 2.
      </div>
    </div>
  );
}
