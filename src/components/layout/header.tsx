import Link from "next/link";
import Image from "next/image";
import { validateSession } from "@/lib/auth/session";
import { HeaderScroll } from "./header-scroll";

export async function Header() {
  const session = await validateSession();

  return (
    <HeaderScroll>
      <div className="flex h-20 items-center justify-between px-6 md:px-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="iRun" width={32} height={37} priority />
          <span className="text-2xl font-bold tracking-tight">iRun</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/articles"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            Articles
          </Link>
          <Link
            href="/training"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            Training
          </Link>
          <Link
            href="/events"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            Events
          </Link>
          <Link
            href="/clubs"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            Clubs
          </Link>
          <Link
            href="/shop"
            className="opacity-70 transition-opacity hover:opacity-100"
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
                className="hidden text-sm font-medium opacity-70 transition-opacity hover:opacity-100 sm:block"
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
    </HeaderScroll>
  );
}
