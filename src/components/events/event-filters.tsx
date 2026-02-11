"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FilterPill } from "@/components/ui/filter-pill";

const DISTANCE_OPTIONS = [
  { value: "5k", label: "5K" },
  { value: "10k", label: "10K" },
  { value: "half", label: "Half Marathon" },
  { value: "marathon", label: "Marathon" },
  { value: "ultra", label: "Ultra" },
];

const TERRAIN_OPTIONS = [
  { value: "road", label: "Road" },
  { value: "trail", label: "Trail" },
  { value: "mixed", label: "Mixed" },
];

const PROVINCE_OPTIONS = [
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "NS", label: "Nova Scotia" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland" },
  { value: "PE", label: "PEI" },
];

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeDistances = searchParams.get("distances")?.split(",") || [];
  const activeTerrain = searchParams.get("terrain")?.split(",") || [];
  const activeProvince = searchParams.get("province") || "";

  const updateParams = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset pagination on filter change
      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  function toggleFilter(key: string, value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams(key, next);
  }

  function toggleProvince(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeProvince === value) {
      params.delete("province");
    } else {
      params.set("province", value);
    }
    params.delete("page");
    router.push(`/events?${params.toString()}`);
  }

  const hasFilters =
    activeDistances.length > 0 ||
    activeTerrain.length > 0 ||
    activeProvince !== "";

  function clearAll() {
    router.push("/events");
  }

  return (
    <div className="space-y-4">
      {/* Distance filters */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {DISTANCE_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            active={activeDistances.includes(opt.value)}
            onClick={() =>
              toggleFilter("distances", opt.value, activeDistances)
            }
          >
            {opt.label}
          </FilterPill>
        ))}
        <span className="mx-1 self-center text-border">|</span>
        {TERRAIN_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            active={activeTerrain.includes(opt.value)}
            onClick={() =>
              toggleFilter("terrain", opt.value, activeTerrain)
            }
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>

      {/* Province filters */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {PROVINCE_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            active={activeProvince === opt.value}
            onClick={() => toggleProvince(opt.value)}
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>

      {/* Active filter summary */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered</span>
          <button
            onClick={clearAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
