import { useEffect, useMemo, useState } from "react";
import {
  getLocations,
  getNearbyLocations,
} from "../api/locations/locations";
import LocationControls from "./LocationControls";
import LocationMap from "./LocationMap";
import LocationResults from "./LocationResults";
import {
  filterLocations,
  getCurrentPosition,
  getGeolocationErrorMessage,
} from "./locationUtils";
import {
  NEARBY_RADIUS_KM,
  type LocationListItem,
  type LocationTypeFilter,
  type StandardLocationTypeFilter,
  type UserLocation,
} from "./locationTypes";

const LocationList = () => {
  // Full/filtered dataset currently shown. Either the result of getLocations()
  // (all approved locations) or getNearbyLocations() (subset with distanceKm).
  const [locations, setLocations] = useState<LocationListItem[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  // Separate message slot just for the "Near me" flow (geolocation errors,
  // unsupported browser, etc.) so it doesn't clash with the main error state.
  const [nearbyMessage, setNearbyMessage] = useState("");
  // True while waiting on navigator.geolocation + the nearby API call.
  const [isLocating, setIsLocating] = useState(false);
  const [search, setSearch] = useState("");
  // "ALL" | "GYM" | "CALISTHENICS_PARK" | "NEARBY"
  // NOTE: "NEARBY" is a special mode — it's not just a client-side filter,
  // it swaps the entire dataset to the nearby API response (see handleNearbyClick).
  const [typeFilter, setTypeFilter] = useState<LocationTypeFilter>("ALL");
  // Only set once the user grants geolocation + "Near me" succeeds.
  // Used to render the "you are here" marker on the map.
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  // Re-fetches the FULL location list (used when leaving "Near me" mode to
  // go back to ALL/GYM/CALISTHENICS_PARK, since those filters apply to the
  // full dataset, not the nearby subset).
  const fetchAllLocations = async (
    nextFilter: StandardLocationTypeFilter = "ALL",
  ) => {
    try {
      setStatus("loading");
      setMessage("");
      setNearbyMessage("");

      const response = await getLocations();

      setLocations(response);
      setSelectedLocationId(response[0]?.id ?? null);
      setTypeFilter(nextFilter);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching locations:", error);
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not load locations.",
      );
    }
  };

  // Initial load on mount. Deliberately NOT using fetchAllLocations here —
  // this version has its own cleanup flag (shouldIgnore) to avoid setting
  // state on an unmounted component if the request resolves after unmount.
  useEffect(() => {
    let shouldIgnore = false;

    getLocations()
      .then((response) => {
        if (shouldIgnore) {
          return;
        }

        setLocations(response);
        setSelectedLocationId(response[0]?.id ?? null);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (shouldIgnore) {
          return;
        }

        console.error("Error fetching locations:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Could not load locations.",
        );
      });

    return () => {
      shouldIgnore = true;
    };
  }, []);

  // Handles clicks on All / Gyms / Parks.
  // If we're currently in "Near me" mode, the nearby dataset doesn't include
  // every location, so we need to re-fetch the full list before applying the
  // new filter. Otherwise just switch the filter on the existing dataset.
  const handleTypeFilterClick = async (
    nextFilter: StandardLocationTypeFilter,
  ) => {
    if (typeFilter === "NEARBY") {
      await fetchAllLocations(nextFilter);
      return;
    }

    setTypeFilter(nextFilter);
  };

  // "Near me" flow:
  // 1. Check geolocation support
  // 2. Ask browser for position (getCurrentPosition wraps navigator.geolocation)
  // 3. Call getNearbyLocations with NEARBY_RADIUS_KM
  // 4. Replace `locations` with the nearby result (these items have distanceKm)
  // 5. Store userLocation so the map can show a "you are here" marker
  // Errors (permission denied, timeout, etc.) are mapped to friendly text via
  // getGeolocationErrorMessage and shown in nearbyMessage, not the main error state.
  const handleNearbyClick = async () => {
    if (!navigator.geolocation) {
      setNearbyMessage("Location is not available in this browser.");
      return;
    }

    try {
      setIsLocating(true);
      setNearbyMessage("");

      const position = await getCurrentPosition();
      const nextUserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      const nearbyLocations = await getNearbyLocations(
        nextUserLocation.latitude,
        nextUserLocation.longitude,
        NEARBY_RADIUS_KM,
      );

      setLocations(nearbyLocations);
      setUserLocation(nextUserLocation);
      setSelectedLocationId(nearbyLocations[0]?.id ?? null);
      setTypeFilter("NEARBY");
      setStatus("success");
    } catch (error) {
      console.error("Error loading nearby locations:", error);
      setNearbyMessage(getGeolocationErrorMessage(error));
    } finally {
      setIsLocating(false);
    }
  };

  // Client-side search + type filtering applied on top of whatever dataset
  // is currently loaded (full list or nearby subset). See locationUtils.
  const filteredLocations = useMemo(
    () => filterLocations(locations, search, typeFilter),
    [locations, search, typeFilter],
  );

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:h-[calc(100vh-15rem)] lg:min-h-136 lg:grid-cols-[minmax(360px,480px)_1fr]">
      <div className="flex min-h-0 flex-col gap-4">
        <LocationControls
          isLocating={isLocating}
          nearbyMessage={nearbyMessage}
          onNearbyClick={handleNearbyClick}
          onSearchChange={setSearch}
          onTypeFilterClick={(nextFilter) =>
            void handleTypeFilterClick(nextFilter)
          }
          search={search}
          typeFilter={typeFilter}
        />

        <LocationResults
          locations={filteredLocations}
          message={message}
          onSelectLocation={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
          status={status}
          typeFilter={typeFilter}
        />
      </div>

      {/* Map mirrors the filtered list: same selection state, same markers,
          plus the "you are here" pin once userLocation is set. */}
      <LocationMap
        locations={filteredLocations}
        onSelectLocation={setSelectedLocationId}
        selectedLocationId={selectedLocationId}
        userLocation={userLocation}
      />
    </section>
  );
};

export default LocationList;
