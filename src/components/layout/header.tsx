import Link from "next/link";
import Image from "next/image";
import { validateSession } from "@/lib/auth/session";
import { HeaderScroll } from "./header-scroll";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/events", label: "Races" },
  { href: "/training", label: "Training" },
  { href: "/clubs", label: "Clubs" },
  { href: "/shop", label: "Shop" },
];

export async function Header() {
  const session = await validateSession();

  return (
    <HeaderScroll>
      <div className="flex h-20 items-center justify-between px-5 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="iRun" width={32} height={37} priority />
          <span className="text-2xl font-bold tracking-tight">iRun</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session ? (
            <Link
              href="/account"
              className="hidden h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              My iRun
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium opacity-70 transition-opacity hover:opacity-100 sm:block"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}

          <MobileMenu isLoggedIn={!!session} />
        </div>
      </div>
    </HeaderScroll>
  );
}
