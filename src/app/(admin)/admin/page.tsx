import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "iRun OS",
};

export default async function AdminDashboardPage() {
  const { user } = await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">iRun OS</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome, {user.displayName}. Internal operations dashboard.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Editorial", description: "Manage articles and content pipeline." },
          { label: "Commerce", description: "Orders, refunds, and product management." },
          { label: "Support", description: "Tickets and runner support." },
          { label: "Analytics", description: "Content and store performance." },
        ].map((section) => (
          <div
            key={section.label}
            className="rounded-lg border border-border p-6"
          >
            <h2 className="font-semibold">{section.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
