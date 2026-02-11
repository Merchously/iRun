import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/guards";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { isStaff } from "@/lib/permissions/check";

export const metadata: Metadata = {
  title: "My iRun",
};

export default async function AccountPage() {
  const { user, roles } = await requireAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My iRun</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {user.displayName}.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Display name</dt>
                <dd>{user.displayName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Member since</dt>
                <dd>
                  {new Date(user.createdAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Roles</dt>
                <dd className="flex gap-2">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Your personalised runner dashboard is coming soon.</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Today&apos;s workout</li>
              <li>Weekly mileage</li>
              <li>Upcoming events</li>
              <li>Saved articles &amp; routes</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {isStaff(roles) && (
        <div className="mt-8">
          <Link
            href="/admin"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open iRun OS (Admin)
          </Link>
        </div>
      )}
    </div>
  );
}
