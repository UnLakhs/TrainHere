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
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-zinc-200" htmlFor="locationSearch">
              Search
            </label>
            <input
              className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
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
          <p className="rounded-md border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
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
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>{filteredLocations.length} locations</span>
              <span>Approved only</span>
            </div>

            {filteredLocations.length === 0 ? (
              <p className="rounded-md border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
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
        ? "rounded-md bg-emerald-400 px-3 py-1.5 text-sm font-semibold text-zinc-950"
        : "rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
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
        ? "rounded-lg border border-emerald-400/60 bg-zinc-900 p-4 shadow-sm shadow-emerald-950/40"
        : "rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 shadow-sm shadow-black/30 transition hover:border-zinc-700"
    }
    onMouseEnter={onSelect}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
          {location.type === "GYM" ? "Gym" : "Calisthenics park"}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{location.name}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {location.city}, {location.country}
        </p>
      </div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-sm font-semibold text-zinc-100">
        {location.averageRating.toFixed(1)}
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-zinc-400">{location.reviewCount} reviews</p>
      <Link
        className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
        to={`/locations/${location.id}`}
      >
        Details
      </Link>
    </div>
  </article>
);

export default LocationList;
