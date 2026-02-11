"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  saveOnboardingStep1,
  saveOnboardingStep2,
  saveOnboardingStep3,
  saveOnboardingStep4,
  saveOnboardingStep5,
} from "@/lib/actions/profile";
import {
  goalDistances,
  surfacePreferences,
  interestOptions,
  canadianProvinces,
} from "@/lib/validators/profile";

type StepState = { error?: string; success?: boolean } | undefined;

const TOTAL_STEPS = 5;

const goalLabels: Record<string, string> = {
  "5k": "5K",
  "10k": "10K",
  half: "Half Marathon",
  marathon: "Marathon",
  ultra: "Ultra",
};

const surfaceLabels: Record<string, string> = {
  road: "Road",
  trail: "Trail",
  mixed: "Mixed",
};

const interestLabels: Record<string, string> = {
  "marathon-training": "Marathon Training",
  "half-marathon": "Half Marathon",
  "5k-10k": "5K / 10K",
  "trail-running": "Trail Running",
  "ultra-running": "Ultra Running",
  nutrition: "Nutrition",
  "gear-reviews": "Gear Reviews",
  "race-reports": "Race Reports",
  "injury-prevention": "Injury Prevention",
  beginners: "Beginners",
  "speed-work": "Speed Work",
  "strength-training": "Strength Training",
};

const provinceLabels: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<Record<string, string | string[]>>(
    {}
  );

  function nextStep() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Step1
          selected={selected.goalDistance as string}
          onSelect={(v) => setSelected((s) => ({ ...s, goalDistance: v }))}
          onNext={nextStep}
        />
      )}
      {step === 2 && <Step2 onNext={nextStep} />}
      {step === 3 && <Step3 onNext={nextStep} />}
      {step === 4 && (
        <Step4
          selected={(selected.interests as string[]) || []}
          onSelect={(v) => setSelected((s) => ({ ...s, interests: v }))}
          onNext={nextStep}
        />
      )}
      {step === 5 && (
        <Step5
          selected={selected.surfacePreference as string}
          onSelect={(v) =>
            setSelected((s) => ({ ...s, surfacePreference: v }))
          }
        />
      )}
    </div>
  );
}

function Step1({
  selected,
  onSelect,
  onNext,
}: {
  selected?: string;
  onSelect: (v: string) => void;
  onNext: () => void;
}) {
  const [state, action, pending] = useActionState<StepState, FormData>(
    saveOnboardingStep1,
    undefined
  );

  useEffect(() => {
    if (state && "success" in state && state.success) onNext();
  }, [state, onNext]);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold">
        What&apos;s your goal distance?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This helps us suggest the right training plans and events.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {goalDistances.map((d) => (
          <label
            key={d}
            className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 p-4 text-center font-medium transition-colors ${
              selected === d
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border hover:border-primary/30"
            }`}
          >
            <input
              type="radio"
              name="goalDistance"
              value={d}
              checked={selected === d}
              onChange={() => onSelect(d)}
              className="sr-only"
            />
            {goalLabels[d]}
          </label>
        ))}
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={onNext}>
          Skip
        </Button>
        <Button type="submit" disabled={!selected || pending}>
          {pending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function Step2({ onNext }: { onNext: () => void }) {
  const [state, action, pending] = useActionState<StepState, FormData>(
    saveOnboardingStep2,
    undefined
  );

  useEffect(() => {
    if (state && "success" in state && state.success) onNext();
  }, [state, onNext]);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold">Current fitness</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Approximate numbers are fine. You can update these later.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="weeklyKilometres" className="text-sm font-medium">
            Weekly kilometres
          </label>
          <input
            id="weeklyKilometres"
            name="weeklyKilometres"
            type="number"
            min={0}
            max={500}
            placeholder="e.g. 30"
            className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div>
          <label htmlFor="easyPace" className="text-sm font-medium">
            Easy pace (min/km)
          </label>
          <input
            id="easyPace"
            name="easyPace"
            type="text"
            placeholder="e.g. 6:30"
            className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={onNext}>
          Skip
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function Step3({ onNext }: { onNext: () => void }) {
  const [state, action, pending] = useActionState<StepState, FormData>(
    saveOnboardingStep3,
    undefined
  );

  useEffect(() => {
    if (state && "success" in state && state.success) onNext();
  }, [state, onNext]);

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold">Where do you run?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We&apos;ll show you events and clubs near you.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="province" className="text-sm font-medium">
            Province / Territory
          </label>
          <select
            id="province"
            name="province"
            className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            <option value="">Select...</option>
            {canadianProvinces.map((p) => (
              <option key={p} value={p}>
                {provinceLabels[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="e.g. Toronto"
            className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={onNext}>
          Skip
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function Step4({
  selected,
  onSelect,
  onNext,
}: {
  selected: string[];
  onSelect: (v: string[]) => void;
  onNext: () => void;
}) {
  const [state, action, pending] = useActionState<StepState, FormData>(
    saveOnboardingStep4,
    undefined
  );

  useEffect(() => {
    if (state && "success" in state && state.success) onNext();
  }, [state, onNext]);

  function toggle(interest: string) {
    onSelect(
      selected.includes(interest)
        ? selected.filter((i) => i !== interest)
        : [...selected, interest]
    );
  }

  return (
    <form
      action={() => {
        const fd = new FormData();
        selected.forEach((i) => fd.append("interests", i));
        action(fd);
      }}
    >
      <h2 className="text-xl font-semibold">What interests you?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick as many as you like. This shapes your article recommendations.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {interestOptions.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selected.includes(interest)
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {interestLabels[interest]}
          </button>
        ))}
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="ghost" onClick={onNext}>
          Skip
        </Button>
        <Button type="submit" disabled={selected.length === 0 || pending}>
          {pending ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function Step5({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (v: string) => void;
}) {
  const [state, action, pending] = useActionState<StepState, FormData>(
    saveOnboardingStep5,
    undefined
  );

  return (
    <form action={action}>
      <h2 className="text-xl font-semibold">Preferred surface</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This helps us recommend the right routes and events.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {surfacePreferences.map((s) => (
          <label
            key={s}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-colors ${
              selected === s
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border hover:border-primary/30"
            }`}
          >
            <input
              type="radio"
              name="surfacePreference"
              value={s}
              checked={selected === s}
              onChange={() => onSelect(s)}
              className="sr-only"
            />
            <span className="text-2xl">
              {s === "road" ? "\uD83D\uDEE4\uFE0F" : s === "trail" ? "\uD83C\uDF32" : "\uD83D\uDD00"}
            </span>
            <span className="mt-2 font-medium">{surfaceLabels[s]}</span>
          </label>
        ))}
      </div>

      {state?.error && (
        <p className="mt-3 text-sm text-destructive">{state.error}</p>
      )}

      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg" disabled={!selected || pending}>
          {pending ? "Finishing..." : "Finish Setup"}
        </Button>
      </div>
    </form>
  );
}
