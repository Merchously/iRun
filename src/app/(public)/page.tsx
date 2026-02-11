import Link from "next/link";
import Image from "next/image";

const pillars = [
  {
    title: "Articles",
    description: "Trusted running journalism and expert guides.",
    href: "/articles",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop",
  },
  {
    title: "Training",
    description: "Pace calculators, workout libraries, and plans.",
    href: "/training",
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop",
  },
  {
    title: "Community",
    description: "Events, run clubs, and monthly challenges.",
    href: "/events",
    image:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&h=600&fit=crop",
  },
  {
    title: "Shop",
    description: "Made-to-order iRun merchandise.",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-24 pt-16 md:px-16 md:pb-40 md:pt-28">
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Your running,
          <br />
          <span className="text-primary">simplified.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground md:mt-8 md:text-xl">
          Training plans, routes, events, and trusted running journalism — all
          in one place. Built for Canadian runners.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 md:mt-12">
          <Link
            href="/register"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:h-14 md:px-10 md:text-base"
          >
            Get started free
          </Link>
          <Link
            href="/articles"
            className="inline-flex h-12 items-center rounded-full border border-border px-8 text-sm font-medium transition-colors hover:bg-muted md:h-14 md:px-10 md:text-base"
          >
            Read the magazine
          </Link>
        </div>
      </section>

      {/* Pillar Cards */}
      <section className="px-6 pb-24 md:px-16 md:pb-40">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Explore iRun
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="group block overflow-hidden rounded-2xl bg-card transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-muted px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Join Canada&apos;s running community
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:mt-6">
            Whether you&apos;re training for your first 5K or your tenth
            marathon, iRun has the tools, content, and community to help you
            reach the finish line.
          </p>
          <Link
            href="/register"
            className="mt-10 inline-flex h-14 items-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create your free account
          </Link>
        </div>
      </section>
    </>
  );
}
