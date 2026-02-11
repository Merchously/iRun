import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { runnerProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Welcome to iRun",
};

export default async function OnboardingPage() {
  const { user } = await requireAuth();

  // If onboarding already completed, go to account
  const [profile] = await db
    .select({ onboardingCompleted: runnerProfiles.onboardingCompleted })
    .from(runnerProfiles)
    .where(eq(runnerProfiles.userId, user.id))
    .limit(1);

  if (profile?.onboardingCompleted) {
    redirect("/account");
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome to iRun
          </h1>
          <p className="mt-2 text-muted-foreground">
            Let&apos;s set up your runner profile. This helps us personalise
            your experience.
          </p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  );
}
