"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/editorial", label: "Editorial" },
  { href: "/admin/commerce", label: "Commerce" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-muted/30 p-4">
      <div className="mb-6">
        <Link href="/admin" className="text-lg font-bold">
          iRun OS
        </Link>
        <p className="text-xs text-muted-foreground">Internal Dashboard</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-border pt-4">
        <Link
          href="/account"
          className="block text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to My iRun
        </Link>
      </div>
    </aside>
  );
}
