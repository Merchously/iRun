"use server";

import { db } from "@/lib/db";
import { runnerProfiles, userInterests, users } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/guards";
import { logAction } from "./audit";
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  onboardingStep4Schema,
  onboardingStep5Schema,
  updateProfileSchema,
} from "@/lib/validators/profile";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

async function ensureProfile(userId: string) {
  const existing = await db
    .select({ id: runnerProfiles.id })
    .from(runnerProfiles)
    .where(eq(runnerProfiles.userId, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(runnerProfiles).values({ userId });
  }
}

export async function saveOnboardingStep1(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requireAuth();
  const parsed = onboardingStep1Schema.safeParse({
    goalDistance: formData.get("goalDistance"),
  });

  if (!parsed.success) {
    return { error: "Please select a goal distance." };
  }

  await ensureProfile(auth.user.id);
  await db
    .update(runnerProfiles)
    .set({ goalDistance: parsed.data.goalDistance, updatedAt: new Date() })
    .where(eq(runnerProfiles.userId, auth.user.id));

  return { success: true };
}

export async function saveOnboardingStep2(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requireAuth();
  const parsed = onboardingStep2Schema.safeParse({
    weeklyKilometres: formData.get("weeklyKilometres") || undefined,
    easyPace: formData.get("easyPace") || undefined,
  });

  if (!parsed.success) {
    return { error: "Please check your input." };
  }

  await ensureProfile(auth.user.id);

  const paceZones = parsed.data.easyPace
    ? { easy: parsed.data.easyPace }
    : undefined;

  await db
    .update(runnerProfiles)
    .set({
      weeklyKilometres: parsed.data.weeklyKilometres ?? null,
      paceZones: paceZones ?? null,
      updatedAt: new Date(),
    })
    .where(eq(runnerProfiles.userId, auth.user.id));

  return { success: true };
}

export async function saveOnboardingStep3(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requireAuth();
  const parsed = onboardingStep3Schema.safeParse({
    province: formData.get("province") || undefined,
    city: formData.get("city") || undefined,
  });

  if (!parsed.success) {
    return { error: "Please check your input." };
  }

  await ensureProfile(auth.user.id);
  await db
    .update(runnerProfiles)
    .set({
      province: parsed.data.province ?? null,
      city: parsed.data.city ?? null,
      updatedAt: new Date(),
    })
    .where(eq(runnerProfiles.userId, auth.user.id));

  return { success: true };
}

export async function saveOnboardingStep4(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requireAuth();
  const interests = formData.getAll("interests") as string[];
  const parsed = onboardingStep4Schema.safeParse({ interests });

  if (!parsed.success) {
    return { error: "Please pick at least one interest." };
  }

  // Remove existing onboarding interests and re-insert
  await db
    .delete(userInterests)
    .where(eq(userInterests.userId, auth.user.id));

  await db.insert(userInterests).values(
    parsed.data.interests.map((interest) => ({
      userId: auth.user.id,
      interest,
      source: "onboarding" as const,
      weight: 5,
    }))
  );

  return { success: true };
}

export async function saveOnboardingStep5(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const auth = await requireAuth();
  const parsed = onboardingStep5Schema.safeParse({
    surfacePreference: formData.get("surfacePreference"),
  });

  if (!parsed.success) {
    return { error: "Please select a surface preference." };
  }

  await ensureProfile(auth.user.id);
  await db
    .update(runnerProfiles)
    .set({
      surfacePreference: parsed.data.surfacePreference,
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(runnerProfiles.userId, auth.user.id));

  await logAction(
    auth.user.id,
    "profile.onboarding_completed",
    "runner_profile",
    auth.user.id
  );

  redirect("/account");
}

export async function updateProfile(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const auth = await requireAuth();
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get("displayName") || undefined,
    bio: formData.get("bio") || undefined,
    goalDistance: formData.get("goalDistance") || undefined,
    weeklyKilometres: formData.get("weeklyKilometres") || undefined,
    surfacePreference: formData.get("surfacePreference") || undefined,
    province: formData.get("province") || undefined,
    city: formData.get("city") || undefined,
    isPublic: formData.get("isPublic"),
  });

  if (!parsed.success) {
    return { error: "Please check your input and try again." };
  }

  // Update display name on users table if provided
  if (parsed.data.displayName) {
    await db
      .update(users)
      .set({ displayName: parsed.data.displayName, updatedAt: new Date() })
      .where(eq(users.id, auth.user.id));
  }

  // Update profile fields
  await ensureProfile(auth.user.id);
  await db
    .update(runnerProfiles)
    .set({
      bio: parsed.data.bio ?? null,
      goalDistance: parsed.data.goalDistance ?? null,
      weeklyKilometres: parsed.data.weeklyKilometres ?? null,
      surfacePreference: parsed.data.surfacePreference ?? null,
      province: parsed.data.province ?? null,
      city: parsed.data.city ?? null,
      isPublic: parsed.data.isPublic ?? false,
      updatedAt: new Date(),
    })
    .where(eq(runnerProfiles.userId, auth.user.id));

  await logAction(
    auth.user.id,
    "profile.update",
    "runner_profile",
    auth.user.id
  );

  return { success: true };
}
