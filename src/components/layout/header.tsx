import Link from "next/link";
import { validateSession } from "@/lib/auth/session";

export async function Header() {
  const session = await validateSession();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          iRun
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
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
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              My iRun
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
