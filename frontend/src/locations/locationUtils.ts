import {
  NEARBY_RADIUS_KM,
  type LocationListItem,
  type LocationTypeFilter,
} from "./locationTypes";

export const filterLocations = (
  locations: LocationListItem[],
  search: string,
  typeFilter: LocationTypeFilter,
) => {
  const normalizedSearch = search.trim().toLowerCase();

  return locations.filter((location) => {
    const matchesType =
      typeFilter === "ALL" || typeFilter === "NEARBY"
        ? true
        : location.type === typeFilter;
    const matchesSearch = normalizedSearch
      ? `${location.name} ${location.city} ${location.country}`
          .toLowerCase()
          .includes(normalizedSearch)
      : true;

    return matchesType && matchesSearch;
  });
};

export const getLocationCountLabel = (
  locationCount: number,
  typeFilter: LocationTypeFilter,
) =>
  typeFilter === "NEARBY"
    ? `${locationCount} locations within ${NEARBY_RADIUS_KM}km`
    : `${locationCount} locations`;

export const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 60_000,
      timeout: 10_000,
    });
  });

export const getGeolocationErrorMessage = (error: unknown) => {
  if (isGeolocationError(error)) {
    if (error.code === error.PERMISSION_DENIED) {
      return "Enable location to see nearby spots.";
    }

    if (error.code === error.POSITION_UNAVAILABLE) {
      return "Could not detect your location right now.";
    }

    if (error.code === error.TIMEOUT) {
      return "Location request timed out. Try again.";
    }
  }

  return error instanceof Error
    ? error.message
    : "Could not load nearby locations.";
};

const isGeolocationError = (
  error: unknown,
): error is GeolocationPositionError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;
