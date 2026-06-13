import type {
  LocationResponse,
  NearbyLocationResponse,
} from "../api/locations/locations";

export type LocationListItem = LocationResponse | NearbyLocationResponse;
export type LocationTypeFilter =
  | "ALL"
  | "FAVORITES"
  | "NEARBY"
  | LocationResponse["type"];
export type StandardLocationTypeFilter = Exclude<
  LocationTypeFilter,
  "FAVORITES" | "NEARBY"
>;

export type UserLocation = {
  latitude: number;
  longitude: number;
};

export const NEARBY_RADIUS_KM = 100;

export const getLocationTypeLabel = (type: LocationResponse["type"]) =>
  type === "GYM" ? "Gym" : "Calisthenics park";

export const getLocationTypeDotClass = (type: LocationResponse["type"]) =>
  type === "GYM"
    ? "h-2 w-2 rounded-[0.2rem] bg-[#6B9BD1]"
    : "h-2 w-2 rounded-full bg-[#3DDC97]";

export const hasDistance = (
  location: LocationListItem,
): location is NearbyLocationResponse => "distanceKm" in location;
