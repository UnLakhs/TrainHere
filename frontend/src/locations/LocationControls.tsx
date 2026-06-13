import LocationFilterButton from "./LocationFilterButton";
import type {
  LocationTypeFilter,
  StandardLocationTypeFilter,
} from "./locationTypes";

type LocationControlsProps = {
  isLocating: boolean;
  nearbyMessage: string;
  onFavoritesClick: () => void;
  onNearbyClick: () => void;
  onSearchChange: (search: string) => void;
  onTypeFilterClick: (filter: StandardLocationTypeFilter) => void;
  search: string;
  typeFilter: LocationTypeFilter;
};

const LocationControls = ({
  isLocating,
  nearbyMessage,
  onFavoritesClick,
  onNearbyClick,
  onSearchChange,
  onTypeFilterClick,
  search,
  typeFilter,
}: LocationControlsProps) => (
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
    </div>

    {nearbyMessage && (
      <p className="mt-3 rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-2 text-sm text-(--color-text-secondary)">
        {nearbyMessage}
      </p>
    )}
  </div>
);

export default LocationControls;
