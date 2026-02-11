import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Trusted running journalism and expert guides from iRun.",
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
      <p className="mt-2 text-muted-foreground">
        Trusted running journalism, guides, and expert insights.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Articles coming in Phase 1.
      </div>
    </div>
  );
}
