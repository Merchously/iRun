import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your running, simplified.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Training plans, routes, events, and trusted running journalism — all
          in one place. Built for Canadian runners.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get started free
          </Link>
          <Link
            href="/articles"
            className="inline-flex h-12 items-center rounded-md border border-border px-6 text-sm font-medium hover:bg-muted"
          >
            Read the magazine
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Articles",
            description: "Trusted running journalism and expert guides.",
            href: "/articles",
          },
          {
            title: "Training",
            description: "Pace calculators, workout libraries, and plans.",
            href: "/training",
          },
          {
            title: "Community",
            description: "Events, run clubs, and monthly challenges.",
            href: "/events",
          },
          {
            title: "Shop",
            description: "Made-to-order iRun merchandise.",
            href: "/shop",
          },
        ].map((pillar) => (
          <Link
            key={pillar.href}
            href={pillar.href}
            className="group rounded-lg border border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <h2 className="text-lg font-semibold group-hover:text-primary">
              {pillar.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {pillar.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
