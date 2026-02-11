import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training",
  description: "Pace calculators, workout library, and training plans.",
};

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Training</h1>
      <p className="mt-2 text-muted-foreground">
        Pace calculators, workout library, and training plans.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-12 text-center text-muted-foreground">
        Training tools coming in Phase 3.
      </div>
    </div>
  );
}
