import { useState } from "react";
import LocationFilterButton from "./LocationFilterButton";
import { NEARBY_RADIUS_KM } from "./locationConstants";
import type {
  AdvancedLocationFilters,
  LocationTypeFilter,
  StandardLocationTypeFilter,
} from "./locationTypes";

type LocationControlsProps = {
  advancedFilters: AdvancedLocationFilters;
  isLocating: boolean;
  nearbyMessage: string;
  onAdvancedFiltersChange: (filters: AdvancedLocationFilters) => void;
  onFavoritesClick: () => void;
  onNearbyClick: () => void;
  onSearchChange: (search: string) => void;
  onTypeFilterClick: (filter: StandardLocationTypeFilter) => void;
  search: string;
  typeFilter: LocationTypeFilter;
};

const LocationControls = ({
  advancedFilters,
  isLocating,
  nearbyMessage,
  onAdvancedFiltersChange,
  onFavoritesClick,
  onNearbyClick,
  onSearchChange,
  onTypeFilterClick,
  search,
  typeFilter,
}: LocationControlsProps) => {
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);
  const activeAdvancedFilterCount =
    (advancedFilters.hasReviewsOnly ? 1 : 0) +
    (advancedFilters.minimumRating > 0 ? 1 : 0) +
    (typeFilter === "NEARBY" &&
    advancedFilters.maxDistanceKm < NEARBY_RADIUS_KM
      ? 1
      : 0);

  const updateAdvancedFilters = (
    nextFilters: Partial<AdvancedLocationFilters>,
  ) => {
    onAdvancedFiltersChange({
      ...advancedFilters,
      ...nextFilters,
    });
  };

  return (
    <div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-4">
      <div className="flex flex-col gap-3">
        <label
          className="text-sm font-medium text-(--color-text-primary)"
          htmlFor="locationSearch"
        >
          Search
        </label>
        <input
          className="rounded-md border border-(--color-border) bg-(--color-page) px-3 py-2.5 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-tertiary) focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20"
          id="locationSearch"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="City, country, or place name"
          type="search"
          value={search}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <LocationFilterButton
          isActive={typeFilter === "ALL"}
          label="All"
          onClick={() => onTypeFilterClick("ALL")}
        />
        <LocationFilterButton
          isActive={typeFilter === "GYM"}
          label="Gyms"
          onClick={() => onTypeFilterClick("GYM")}
        />
        <LocationFilterButton
          isActive={typeFilter === "CALISTHENICS_PARK"}
          label="Parks"
          onClick={() => onTypeFilterClick("CALISTHENICS_PARK")}
        />
        <LocationFilterButton
          isActive={typeFilter === "FAVORITES"}
          label="Favorites"
          onClick={onFavoritesClick}
        />
        <LocationFilterButton
          isActive={typeFilter === "NEARBY"}
          isLoading={isLocating}
          label={isLocating ? "Locating..." : "Near me"}
          onClick={onNearbyClick}
        />
        <button
          className={
            areFiltersOpen || activeAdvancedFilterCount > 0
              ? "rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-1.5 text-sm font-semibold text-(--color-text-primary) shadow-sm shadow-black/10"
              : "rounded-md border border-(--color-border) px-3 py-1.5 text-sm font-semibold text-(--color-text-secondary) transition hover:bg-(--color-elevated) hover:text-(--color-text-primary)"
          }
          onClick={() => setAreFiltersOpen((isOpen) => !isOpen)}
          type="button"
        >
          Filters
          {activeAdvancedFilterCount > 0 ? ` (${activeAdvancedFilterCount})` : ""} v
        </button>
      </div>

      {areFiltersOpen && (
        <div className="mt-4 rounded-lg border border-(--color-border) bg-(--color-page) p-4">
          <div className="grid gap-4">
            <section className="grid gap-3">
              <h3 className="text-sm font-semibold text-(--color-text-primary)">
                Universal
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-(--color-text-secondary)">
                  Minimum rating
                  <select
                    className="rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-(--color-text-primary) outline-none focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20"
                    onChange={(event) =>
                      updateAdvancedFilters({
                        minimumRating: Number(event.target.value),
                      })
                    }
                    value={advancedFilters.minimumRating}
                  >
                    <option value={0}>Any rating</option>
                    <option value={4}>4+ stars</option>
                    <option value={3}>3+ stars</option>
                    <option value={2}>2+ stars</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 self-end rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm font-medium text-(--color-text-primary)">
                  <input
                    checked={advancedFilters.hasReviewsOnly}
                    className="h-4 w-4 accent-(--color-accent-indicator)"
                    onChange={(event) =>
                      updateAdvancedFilters({
                        hasReviewsOnly: event.target.checked,
                      })
                    }
                    type="checkbox"
                  />
                  Has reviews
                </label>
              </div>

              {typeFilter === "NEARBY" && (
                <label className="flex flex-col gap-2 text-sm text-(--color-text-secondary)">
                  Distance within {advancedFilters.maxDistanceKm} km
                  <input
                    className="accent-(--color-accent-indicator)"
                    max={NEARBY_RADIUS_KM}
                    min={5}
                    onChange={(event) =>
                      updateAdvancedFilters({
                        maxDistanceKm: Number(event.target.value),
                      })
                    }
                    step={5}
                    type="range"
                    value={advancedFilters.maxDistanceKm}
                  />
                </label>
              )}
            </section>

            {typeFilter === "GYM" && <GymFilterPreview />}
            {typeFilter === "CALISTHENICS_PARK" && <ParkFilterPreview />}
          </div>
        </div>
      )}

      {nearbyMessage && (
        <p className="mt-3 rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-2 text-sm text-(--color-text-secondary)">
          {nearbyMessage}
        </p>
      )}
    </div>
  );
};

const GymFilterPreview = () => (
  <section className="grid gap-3 border-t border-(--color-border) pt-4">
    <h3 className="text-sm font-semibold text-(--color-text-primary)">
      Gym filters
    </h3>
    <div className="grid gap-2 sm:grid-cols-2">
      {["Day pass", "24/7 access", "Free weights", "Showers"].map((label) => (
        <DisabledFilterOption key={label} label={label} />
      ))}
    </div>
  </section>
);

const ParkFilterPreview = () => (
  <section className="grid gap-3 border-t border-(--color-border) pt-4">
    <h3 className="text-sm font-semibold text-(--color-text-primary)">
      Park filters
    </h3>
    <div className="grid gap-2 sm:grid-cols-2">
      {["Pull-up bars", "Dip bars", "Lighting", "Water access"].map((label) => (
        <DisabledFilterOption key={label} label={label} />
      ))}
    </div>
  </section>
);

const DisabledFilterOption = ({ label }: { label: string }) => (
  <label className="flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm font-medium text-(--color-text-tertiary)">
    <input className="h-4 w-4" disabled type="checkbox" />
    {label}
  </label>
);

export default LocationControls;
