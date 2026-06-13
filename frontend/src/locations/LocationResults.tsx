import LocationCard from "./LocationCard";
import { getLocationCountLabel } from "./locationUtils";
import type { LocationListItem, LocationTypeFilter } from "./locationTypes";

type LocationResultsProps = {
  locations: LocationListItem[];
  message: string;
  onSelectLocation: (locationId: string) => void;
  selectedLocationId: string | null;
  status: "loading" | "success" | "error";
  typeFilter: LocationTypeFilter;
};

const LocationResults = ({
  locations,
  message,
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
        <span>Approved only</span>
      </div>

      {locations.length === 0 ? (
        <p className="rounded-md border border-(--color-border) bg-(--color-surface) p-4 text-sm text-(--color-text-secondary)">
          No locations match these filters.
        </p>
      ) : (
        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]">
          {locations.map((location) => (
            <LocationCard
              isSelected={selectedLocationId === location.id}
              key={location.id}
              location={location}
              onSelect={() => onSelectLocation(location.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationResults;
