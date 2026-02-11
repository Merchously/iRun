"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  eventTypes,
  terrainTypes,
  distanceCategories,
} from "@/lib/validators/events";
import { canadianProvinces } from "@/lib/validators/profile";

interface DistanceRow {
  distance: string;
  distanceKm?: string;
  distanceLabel?: string;
  priceCad?: string;
  capacity?: string;
  cutoffTime?: string;
}

interface EventFormProps {
  action: (
    prevState: { error?: string } | undefined,
    formData: FormData
  ) => Promise<{ error?: string } | undefined>;
  initialData?: {
    name?: string;
    slug?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    registrationDeadline?: string;
    city?: string;
    province?: string;
    country?: string;
    venue?: string;
    latitude?: string;
    longitude?: string;
    description?: string;
    shortDescription?: string;
    heroImageUrl?: string;
    thumbnailUrl?: string;
    terrain?: string;
    elevationGainMetres?: string;
    courseDescription?: string;
    avgTemperatureCelsius?: string;
    avgPrecipitationMm?: string;
    weatherNotes?: string;
    priceFromCad?: string;
    priceToCad?: string;
    registrationUrl?: string;
    websiteUrl?: string;
    resultsUrl?: string;
    organizerName?: string;
    featured?: boolean;
    status?: string;
  };
  initialDistances?: DistanceRow[];
  submitLabel: string;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const labelClass = "block text-sm font-medium text-foreground mb-1";
const sectionClass = "mt-8 border-t border-border pt-6";

export function EventForm({
  action,
  initialData,
  initialDistances,
  submitLabel,
}: EventFormProps) {
  const [state, formAction, isPending] = useActionState<
    { error?: string } | undefined,
    FormData
  >(action, undefined);

  const [distances, setDistances] = useState<DistanceRow[]>(
    initialDistances || []
  );

  function addDistance() {
    setDistances([...distances, { distance: "5k" }]);
  }

  function removeDistance(index: number) {
    setDistances(distances.filter((_, i) => i !== index));
  }

  function updateDistance(
    index: number,
    field: keyof DistanceRow,
    value: string
  ) {
    setDistances(
      distances.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  return (
    <form
      action={(formData) => {
        formData.set("distances", JSON.stringify(distances));
        formAction(formData);
      }}
    >
      {state?.error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      {/* Basic info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            Event Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
            defaultValue={initialData?.name}
            onChange={(e) => {
              if (!initialData?.slug) {
                const slugInput = document.getElementById(
                  "slug"
                ) as HTMLInputElement;
                if (slugInput) slugInput.value = generateSlug(e.target.value);
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            URL Slug *
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className={inputClass}
            defaultValue={initialData?.slug}
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          />
        </div>

        <div>
          <label htmlFor="eventType" className={labelClass}>
            Event Type *
          </label>
          <select
            id="eventType"
            name="eventType"
            className={inputClass}
            defaultValue={initialData?.eventType || "race"}
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            className={inputClass}
            defaultValue={initialData?.status || "draft"}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="featured" className={labelClass}>
            Featured
          </label>
          <select
            id="featured"
            name="featured"
            className={inputClass}
            defaultValue={initialData?.featured ? "true" : "false"}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Dates</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="startDate" className={labelClass}>
              Start Date *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              className={inputClass}
              defaultValue={initialData?.startDate}
            />
          </div>
          <div>
            <label htmlFor="endDate" className={labelClass}>
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className={inputClass}
              defaultValue={initialData?.endDate}
            />
          </div>
          <div>
            <label htmlFor="registrationDeadline" className={labelClass}>
              Registration Deadline
            </label>
            <input
              id="registrationDeadline"
              name="registrationDeadline"
              type="date"
              className={inputClass}
              defaultValue={initialData?.registrationDeadline}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Location</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClass}>
              City *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className={inputClass}
              defaultValue={initialData?.city}
            />
          </div>
          <div>
            <label htmlFor="province" className={labelClass}>
              Province *
            </label>
            <select
              id="province"
              name="province"
              required
              className={inputClass}
              defaultValue={initialData?.province}
            >
              <option value="">Select province</option>
              {canadianProvinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="venue" className={labelClass}>
              Venue
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              className={inputClass}
              defaultValue={initialData?.venue}
            />
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              className={inputClass}
              defaultValue={initialData?.country || "CA"}
            />
          </div>
          <div>
            <label htmlFor="latitude" className={labelClass}>
              Latitude
            </label>
            <input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              className={inputClass}
              defaultValue={initialData?.latitude}
            />
          </div>
          <div>
            <label htmlFor="longitude" className={labelClass}>
              Longitude
            </label>
            <input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              className={inputClass}
              defaultValue={initialData?.longitude}
            />
          </div>
        </div>
      </div>

      {/* Course */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Course</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="terrain" className={labelClass}>
              Terrain
            </label>
            <select
              id="terrain"
              name="terrain"
              className={inputClass}
              defaultValue={initialData?.terrain || ""}
            >
              <option value="">Not specified</option>
              {terrainTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="elevationGainMetres" className={labelClass}>
              Elevation Gain (m)
            </label>
            <input
              id="elevationGainMetres"
              name="elevationGainMetres"
              type="number"
              className={inputClass}
              defaultValue={initialData?.elevationGainMetres}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="courseDescription" className={labelClass}>
              Course Description
            </label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              rows={3}
              className={inputClass}
              defaultValue={initialData?.courseDescription}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Content</h3>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="shortDescription" className={labelClass}>
              Short Description (max 200 chars)
            </label>
            <input
              id="shortDescription"
              name="shortDescription"
              type="text"
              maxLength={200}
              className={inputClass}
              defaultValue={initialData?.shortDescription}
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>
              Full Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className={inputClass}
              defaultValue={initialData?.description}
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Media</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="heroImageUrl" className={labelClass}>
              Hero Image URL
            </label>
            <input
              id="heroImageUrl"
              name="heroImageUrl"
              type="url"
              className={inputClass}
              defaultValue={initialData?.heroImageUrl}
            />
          </div>
          <div>
            <label htmlFor="thumbnailUrl" className={labelClass}>
              Thumbnail URL
            </label>
            <input
              id="thumbnailUrl"
              name="thumbnailUrl"
              type="url"
              className={inputClass}
              defaultValue={initialData?.thumbnailUrl}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Pricing</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="priceFromCad" className={labelClass}>
              Price From (cents CAD)
            </label>
            <input
              id="priceFromCad"
              name="priceFromCad"
              type="number"
              className={inputClass}
              defaultValue={initialData?.priceFromCad}
            />
          </div>
          <div>
            <label htmlFor="priceToCad" className={labelClass}>
              Price To (cents CAD)
            </label>
            <input
              id="priceToCad"
              name="priceToCad"
              type="number"
              className={inputClass}
              defaultValue={initialData?.priceToCad}
            />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Links</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="registrationUrl" className={labelClass}>
              Registration URL
            </label>
            <input
              id="registrationUrl"
              name="registrationUrl"
              type="url"
              className={inputClass}
              defaultValue={initialData?.registrationUrl}
            />
          </div>
          <div>
            <label htmlFor="websiteUrl" className={labelClass}>
              Website URL
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              className={inputClass}
              defaultValue={initialData?.websiteUrl}
            />
          </div>
          <div>
            <label htmlFor="resultsUrl" className={labelClass}>
              Results URL
            </label>
            <input
              id="resultsUrl"
              name="resultsUrl"
              type="url"
              className={inputClass}
              defaultValue={initialData?.resultsUrl}
            />
          </div>
          <div>
            <label htmlFor="organizerName" className={labelClass}>
              Organizer Name
            </label>
            <input
              id="organizerName"
              name="organizerName"
              type="text"
              className={inputClass}
              defaultValue={initialData?.organizerName}
            />
          </div>
        </div>
      </div>

      {/* Weather */}
      <div className={sectionClass}>
        <h3 className="text-lg font-semibold">Weather (Historical Averages)</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="avgTemperatureCelsius" className={labelClass}>
              Avg Temperature (&deg;C)
            </label>
            <input
              id="avgTemperatureCelsius"
              name="avgTemperatureCelsius"
              type="number"
              className={inputClass}
              defaultValue={initialData?.avgTemperatureCelsius}
            />
          </div>
          <div>
            <label htmlFor="avgPrecipitationMm" className={labelClass}>
              Avg Precipitation (mm)
            </label>
            <input
              id="avgPrecipitationMm"
              name="avgPrecipitationMm"
              type="number"
              className={inputClass}
              defaultValue={initialData?.avgPrecipitationMm}
            />
          </div>
          <div>
            <label htmlFor="weatherNotes" className={labelClass}>
              Weather Notes
            </label>
            <input
              id="weatherNotes"
              name="weatherNotes"
              type="text"
              maxLength={500}
              className={inputClass}
              defaultValue={initialData?.weatherNotes}
            />
          </div>
        </div>
      </div>

      {/* Distances */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Distances</h3>
          <button
            type="button"
            onClick={addDistance}
            className="text-sm font-medium text-primary hover:underline"
          >
            + Add Distance
          </button>
        </div>

        {distances.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No distances added yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {distances.map((d, i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">
                    Distance #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDistance(i)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Category *
                    </label>
                    <select
                      className={inputClass}
                      value={d.distance}
                      onChange={(e) =>
                        updateDistance(i, "distance", e.target.value)
                      }
                    >
                      {distanceCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={inputClass}
                      value={d.distanceKm || ""}
                      onChange={(e) =>
                        updateDistance(i, "distanceKm", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Label
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={d.distanceLabel || ""}
                      onChange={(e) =>
                        updateDistance(i, "distanceLabel", e.target.value)
                      }
                      placeholder="e.g. Kids Fun Run"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Price (cents CAD)
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={d.priceCad || ""}
                      onChange={(e) =>
                        updateDistance(i, "priceCad", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Capacity
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={d.capacity || ""}
                      onChange={(e) =>
                        updateDistance(i, "capacity", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Cutoff Time
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={d.cutoffTime || ""}
                      onChange={(e) =>
                        updateDistance(i, "cutoffTime", e.target.value)
                      }
                      placeholder="e.g. 6:00:00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="mt-8 flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
