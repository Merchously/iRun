import Link from "next/link";
import { validateSession } from "@/lib/auth/session";

export async function Header() {
  const session = await validateSession();

  return (
    <header className="bg-background">
      <div className="flex h-20 items-center justify-between px-6 md:px-16">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          iRun
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/articles"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Articles
          </Link>
          <Link
            href="/training"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Training
          </Link>
          <Link
            href="/events"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Events
          </Link>
          <Link
            href="/clubs"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Clubs
          </Link>
          <Link
            href="/shop"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/account"
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              My iRun
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
