"use strict";

import { z } from "zod/v4";

export const goalDistances = [
  "5k",
  "10k",
  "half",
  "marathon",
  "ultra",
] as const;

export const surfacePreferences = ["road", "trail", "mixed"] as const;

export const interestOptions = [
  "marathon-training",
  "half-marathon",
  "5k-10k",
  "trail-running",
  "ultra-running",
  "nutrition",
  "gear-reviews",
  "race-reports",
  "injury-prevention",
  "beginners",
  "speed-work",
  "strength-training",
] as const;

export const canadianProvinces = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const;

export const onboardingStep1Schema = z.object({
  goalDistance: z.enum(goalDistances),
});

export const onboardingStep2Schema = z.object({
  weeklyKilometres: z.coerce
    .number()
    .int()
    .min(0, "Must be 0 or greater")
    .max(500, "That seems too high")
    .optional(),
  easyPace: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/, "Use format like 6:30")
    .optional(),
});

export const onboardingStep3Schema = z.object({
  province: z.enum(canadianProvinces).optional(),
  city: z.string().max(100).optional(),
});

export const onboardingStep4Schema = z.object({
  interests: z.array(z.enum(interestOptions)).min(1, "Pick at least one"),
});

export const onboardingStep5Schema = z.object({
  surfacePreference: z.enum(surfacePreferences),
});

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name is too long")
    .optional(),
  bio: z.string().max(500, "Bio is too long").optional(),
  goalDistance: z.enum(goalDistances).optional(),
  weeklyKilometres: z.coerce.number().int().min(0).max(500).optional(),
  surfacePreference: z.enum(surfacePreferences).optional(),
  province: z.enum(canadianProvinces).optional(),
  city: z.string().max(100).optional(),
  isPublic: z.coerce.boolean().optional(),
});
