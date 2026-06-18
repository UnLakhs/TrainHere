import LocationCard from "./LocationCard";
import { getLocationCountLabel } from "./locationUtils";
import type { LocationListItem, LocationTypeFilter } from "./locationTypes";

type LocationResultsProps = {
  favoriteLocationIds: Set<string>;
  favoriteMessage: string;
  isUserAuthenticated: boolean;
  locations: LocationListItem[];
  message: string;
  onFavoriteClick: (locationId: string) => void;
  onSelectLocation: (locationId: string) => void;
  selectedLocationId: string | null;
  status: "loading" | "success" | "error";
  typeFilter: LocationTypeFilter;
};

const LocationResults = ({
  favoriteLocationIds,
  favoriteMessage,
  isUserAuthenticated,
  locations,
  message,
  onFavoriteClick,
  onSelectLocation,
  selectedLocationId,
  status,
  typeFilter,
}: LocationResultsProps) => {
  if (status === "loading") {
    return (
      <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
        Loading locations...
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        {message}
      </p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-(--color-text-secondary)">
        <span>{getLocationCountLabel(locations.length, typeFilter)}</span>
      </div>
      {favoriteMessage && (
        <p className="rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-2 text-sm text-(--color-text-secondary)">
          {favoriteMessage}
        </p>
      )}

      {locations.length === 0 ? (
        <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
          No locations match these filters.
        </p>
      ) : (
        <div className="relative min-h-0 flex-1">
          <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto pr-2 pb-8 [scrollbar-color:var(--color-border)_transparent] scrollbar-thin">
            {locations.map((location) => (
              <LocationCard
                isFavorite={favoriteLocationIds.has(location.id)}
                isSelected={selectedLocationId === location.id}
                isUserAuthenticated={isUserAuthenticated}
                key={location.id}
                location={location}
                onFavoriteClick={onFavoriteClick}
                onSelect={() => onSelectLocation(location.id)}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-(--color-page) to-transparent" />
        </div>
      )}
    </div>
  );
};

export default LocationResults;
