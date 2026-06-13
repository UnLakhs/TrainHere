import type { LocationResponse } from "../locations/locations";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type FavoriteResponse = {
  id: string;
  location: LocationResponse;
};

export const getFavorites = async (): Promise<FavoriteResponse[]> => {
  const response = await fetch(`${baseUrl}/api/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to fetch favorites.");
  }

  return await response.json();
};

export const addFavorite = async (
  locationId: string,
): Promise<FavoriteResponse> => {
  const response = await fetch(`${baseUrl}/api/favorites/${locationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to save favorite.");
  }

  return await response.json();
};

export const removeFavorite = async (locationId: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/favorites/${locationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to remove favorite.");
  }
};

const getAuthorizationHeader = (): Record<string, string> => {
  const token = localStorage.getItem("trainhereToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
