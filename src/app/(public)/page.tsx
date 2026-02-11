import Link from "next/link";
import Image from "next/image";
import { HeroAnimations } from "@/components/home/hero-animations";

const featuredRaces = [
  {
    title: "Toronto Waterfront Marathon",
    date: "October 2026",
    city: "Toronto, ON",
    distances: ["5K", "Half", "Marathon"],
    image:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=640&h=400&fit=crop",
    href: "/events",
  },
  {
    title: "BMO Vancouver Marathon",
    date: "May 2026",
    city: "Vancouver, BC",
    distances: ["8K", "Half", "Marathon"],
    image:
      "https://images.unsplash.com/photo-1544899489-a083461b088c?w=640&h=400&fit=crop",
    href: "/events",
  },
  {
    title: "Ottawa Marathon",
    date: "May 2026",
    city: "Ottawa, ON",
    distances: ["5K", "10K", "Half", "Marathon"],
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=640&h=400&fit=crop",
    href: "/events",
  },
  {
    title: "Bluenose Marathon",
    date: "May 2026",
    city: "Halifax, NS",
    distances: ["5K", "10K", "Half", "Marathon"],
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=640&h=400&fit=crop",
    href: "/events",
  },
  {
    title: "Banff Marathon",
    date: "June 2026",
    city: "Banff, AB",
    distances: ["Half", "Marathon"],
    image:
      "https://images.unsplash.com/photo-1486218119243-13883505764c?w=640&h=400&fit=crop",
    href: "/events",
  },
];

const latestArticles = [
  {
    title: "How to Build Your Marathon Base",
    category: "Training",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=640&h=360&fit=crop",
    href: "/articles",
  },
  {
    title: "The Best Trail Running Shoes of 2026",
    category: "Gear",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&h=360&fit=crop",
    href: "/articles",
  },
  {
    title: "Race Day Nutrition: A Complete Guide",
    category: "Nutrition",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=640&h=360&fit=crop",
    href: "/articles",
  },
  {
    title: "Injury Prevention for New Runners",
    category: "Health",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=360&fit=crop",
    href: "/articles",
  },
];

const howItWorks = [
  {
    title: "Create your profile",
    description:
      "Tell us your goals, pace, and interests. We personalise everything from there.",
  },
  {
    title: "Discover & train",
    description:
      "Find races, follow training plans, and read curated articles matched to your goals.",
  },
  {
    title: "Track your progress",
    description:
      "Log workouts, track mileage, and watch your fitness improve week by week.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroAnimations />

      {/* Hero with full background image */}
      <section
        data-hero
        className="relative flex min-h-[90vh] items-end overflow-hidden md:min-h-screen"
      >
        <div
          data-hero-image
          className="absolute inset-0 -top-[10%] h-[120%] w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1486218119243-13883505764c?w=1920&h=1080&fit=crop"
            alt="Runner at sunrise"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div
          data-hero-overlay
          className="absolute inset-0 bg-black/50"
        />

        <div className="relative z-10 px-5 pb-16 pt-40 md:px-12 md:pb-24 md:pt-60 lg:px-20">
          <h1
            data-hero-heading
            className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block">Your running,</span>
            <span className="block text-primary">simplified.</span>
          </h1>
          <p
            data-hero-sub
            className="mt-6 max-w-xl text-lg text-white/80 md:mt-8 md:text-xl"
          >
            Training plans, races, events, and trusted running journalism — all
            in one place. Built for Canadian runners.
          </p>
          <div data-hero-cta className="mt-10 flex flex-wrap gap-4 md:mt-12">
            <Link
              href="/register"
              className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:h-14 md:px-10 md:text-base"
            >
              Get started free
            </Link>
            <Link
              href="/events"
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10 md:h-14 md:px-10 md:text-base"
            >
              Find a race
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Races Carousel */}
      <section className="px-5 py-20 md:px-12 md:py-32 lg:px-20">
        <div data-animate className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Featured Races
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Discover Canada&apos;s best running events
            </p>
          </div>
          <Link
            href="/events"
            className="hidden text-sm font-medium text-primary hover:underline md:block"
          >
            View all races
          </Link>
        </div>

        <div className="scrollbar-hide mt-8 flex gap-4 overflow-x-auto md:mt-10 md:gap-6">
          {featuredRaces.map((race) => (
            <Link
              key={race.title}
              href={race.href}
              data-card
              className="group w-72 flex-none md:w-80"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="overflow-hidden rounded-2xl bg-card transition-transform duration-300 group-hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={race.image}
                    alt={race.title}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-semibold group-hover:text-primary">
                    {race.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {race.date} &middot; {race.city}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {race.distances.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/events"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all races
          </Link>
        </div>
      </section>

      {/* How iRun Works */}
      <section
        data-animate
        className="bg-surface px-5 py-20 md:px-12 md:py-32 lg:px-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            How iRun Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Everything a Canadian runner needs in one platform.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:mt-16 md:grid-cols-3 md:gap-12">
          {howItWorks.map((item, i) => (
            <div key={i} data-card className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles Carousel */}
      <section className="px-5 py-20 md:px-12 md:py-32 lg:px-20">
        <div data-animate className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Latest Articles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Expert journalism and guides from iRun Magazine
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden text-sm font-medium text-primary hover:underline md:block"
          >
            View all articles
          </Link>
        </div>

        <div className="scrollbar-hide mt-8 flex gap-4 overflow-x-auto md:mt-10 md:gap-6">
          {latestArticles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              data-card
              className="group w-72 flex-none md:w-80"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="overflow-hidden rounded-2xl bg-card transition-transform duration-300 group-hover:-translate-y-1">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold group-hover:text-primary">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/articles"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all articles
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        data-animate
        className="bg-muted px-5 py-20 md:px-12 md:py-32 lg:px-20"
      >
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
