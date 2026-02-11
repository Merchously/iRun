import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} iRun. All rights reserved.
          </p>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/articles" className="hover:text-foreground">
              Articles
            </Link>
            <Link href="/events" className="hover:text-foreground">
              Events
            </Link>
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
