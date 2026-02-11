import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="px-5 py-12 md:px-12 md:py-16 lg:px-20">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="iRun" width={28} height={32} />
              <span className="text-xl font-bold tracking-tight">iRun</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Media, training, community, and commerce for Canadian runners.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform
              </h4>
              <nav className="mt-4 flex flex-col gap-3 text-sm">
                <Link
                  href="/articles"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Articles
                </Link>
                <Link
                  href="/training"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Training
                </Link>
                <Link
                  href="/events"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Races & Events
                </Link>
                <Link
                  href="/routes"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Routes
                </Link>
                <Link
                  href="/clubs"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Clubs
                </Link>
                <Link
                  href="/shop"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Shop
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </h4>
              <nav className="mt-4 flex flex-col gap-3 text-sm">
                <Link
                  href="/login"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Sign up
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} iRun. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
