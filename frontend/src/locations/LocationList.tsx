import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getLocations,
  type LocationResponse,
} from "../api/locations/locations";
import LocationMap from "./LocationMap";

type LocationTypeFilter = "ALL" | LocationResponse["type"];

const LocationList = () => {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LocationTypeFilter>("ALL");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setStatus("loading");
        setMessage("");
        const response = await getLocations();
        setLocations(response);
        setSelectedLocationId(response[0]?.id ?? null);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching locations:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Could not load locations.",
        );
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return locations.filter((location) => {
      const matchesType =
        typeFilter === "ALL" ? true : location.type === typeFilter;
      const matchesSearch = normalizedSearch
        ? `${location.name} ${location.city} ${location.country}`
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      return matchesType && matchesSearch;
    });
  }, [locations, search, typeFilter]);

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[minmax(360px,480px)_1fr]">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="locationSearch">
              Search
            </label>
            <input
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-2.5 text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent-indicator)] focus:ring-2 focus:ring-[var(--color-accent-indicator)]/20"
              id="locationSearch"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="City, country, or place name"
              type="search"
              value={search}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterButton
              isActive={typeFilter === "ALL"}
              label="All"
              onClick={() => setTypeFilter("ALL")}
            />
            <FilterButton
              isActive={typeFilter === "GYM"}
              label="Gyms"
              onClick={() => setTypeFilter("GYM")}
            />
            <FilterButton
              isActive={typeFilter === "CALISTHENICS_PARK"}
              label="Parks"
              onClick={() => setTypeFilter("CALISTHENICS_PARK")}
            />
          </div>
        </div>

        {status === "loading" && (
          <p className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
            Loading locations...
          </p>
        )}

        {status === "error" && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        )}

        {status === "success" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
              <span>{filteredLocations.length} locations</span>
              <span>Approved only</span>
            </div>

            {filteredLocations.length === 0 ? (
              <p className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
                No locations match these filters.
              </p>
            ) : (
              filteredLocations.map((location) => (
                <LocationCard
                  isSelected={selectedLocationId === location.id}
                  key={location.id}
                  location={location}
                  onSelect={() => setSelectedLocationId(location.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <LocationMap
        locations={filteredLocations}
        onSelectLocation={setSelectedLocationId}
        selectedLocationId={selectedLocationId}
      />
    </section>
  );
};

const FilterButton = ({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    className={
      isActive
        ? "rounded-md border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm shadow-black/10"
        : "rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-elevated)] hover:text-[var(--color-text-primary)]"
    }
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

const LocationCard = ({
  isSelected,
  location,
  onSelect,
}: {
  isSelected: boolean;
  location: LocationResponse;
  onSelect: () => void;
}) => (
  <article
    className={
      isSelected
        ? "relative rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] p-4 shadow-sm shadow-black/20"
        : "relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm shadow-black/10 transition hover:bg-[var(--color-elevated)]"
    }
    onMouseEnter={onSelect}
  >
    {isSelected && (
      <span className="absolute left-0 top-4 h-8 w-1 rounded-r-full bg-[var(--color-accent-indicator)]" />
    )}
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
          <span
            className={
              location.type === "GYM"
                ? "h-2 w-2 rounded-full bg-[var(--color-category-neutral)]"
                : "h-2 w-2 rounded-full bg-[var(--color-category-blue)]"
            }
          />
          {getLocationTypeLabel(location.type)}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">{location.name}</h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {location.city}, {location.country}
        </p>
      </div>
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-page)] px-2.5 py-1 text-sm font-semibold text-[var(--color-text-primary)]">
        {location.averageRating.toFixed(1)}
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-[var(--color-text-secondary)]">{location.reviewCount} reviews</p>
      <Link
        className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-indicator)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
        to={`/locations/${location.id}`}
      >
        Details
      </Link>
    </div>
  </article>
);

const getLocationTypeLabel = (type: LocationResponse["type"]) =>
  type === "GYM" ? "Gym" : "Calisthenics park";

export default LocationList;
