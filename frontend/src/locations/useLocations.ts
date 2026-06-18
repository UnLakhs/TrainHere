import { useCallback, useEffect, useState } from "react";
import { getLocations, getNearbyLocations } from "../api/locations/locations";
import { NEARBY_RADIUS_KM } from "./locationConstants";
import type {
  LocationListItem,
  LocationTypeFilter,
  StandardLocationTypeFilter,
  UserLocation,
} from "./locationTypes";
import { getCurrentPosition, getGeolocationErrorMessage } from "./locationUtils";

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationListItem[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [nearbyMessage, setNearbyMessage] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<LocationTypeFilter>("ALL");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  const applyLocations = useCallback(
    (
      nextLocations: LocationListItem[],
      nextFilter: LocationTypeFilter = typeFilter,
    ) => {
      setLocations(nextLocations);
      setSelectedLocationId(nextLocations[0]?.id ?? null);
      setTypeFilter(nextFilter);
      setStatus("success");
    },
    [typeFilter],
  );

  const fetchAllLocations = useCallback(
    async (nextFilter: StandardLocationTypeFilter = "ALL") => {
      try {
        setStatus("loading");
        setMessage("");
        setNearbyMessage("");

        const response = await getLocations();
        applyLocations(response, nextFilter);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Could not load locations.",
        );
      }
    },
    [applyLocations],
  );

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

  const handleTypeFilterClick = async (
    nextFilter: StandardLocationTypeFilter,
  ) => {
    if (typeFilter === "NEARBY") {
      await fetchAllLocations(nextFilter);
      return;
    }

    setTypeFilter(nextFilter);
  };

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

      setUserLocation(nextUserLocation);
      applyLocations(nearbyLocations, "NEARBY");
    } catch (error) {
      console.error("Error loading nearby locations:", error);
      setNearbyMessage(getGeolocationErrorMessage(error));
    } finally {
      setIsLocating(false);
    }
  };

  return {
    fetchAllLocations,
    handleNearbyClick,
    handleTypeFilterClick,
    isLocating,
    locations,
    message,
    nearbyMessage,
    selectedLocationId,
    setSelectedLocationId,
    setTypeFilter,
    status,
    typeFilter,
    userLocation,
  };
};
