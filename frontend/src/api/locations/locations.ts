const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type LocationResponse = {
  id: string;
  name: string;
  type: "GYM" | "CALISTHENICS_PARK";
  status: LocationStatus;
  description: string | null;
  city: string;
  country: string;
  address: string | null;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
};

export type NearbyLocationResponse = LocationResponse & {
  distanceKm: number;
};

export type LocationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LocationRequest = {
  name: string;
  type: "GYM" | "CALISTHENICS_PARK";
  description: string;
  country: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type LocationBoundsRequest = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};

//get all APPROVED locations
export const getLocations = async (): Promise<LocationResponse[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch locations.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const getLocationsWithinBounds = async (
  bounds: LocationBoundsRequest,
): Promise<LocationResponse[]> => {
  try {
    const searchParams = new URLSearchParams({
      minLatitude: String(bounds.minLatitude),
      maxLatitude: String(bounds.maxLatitude),
      minLongitude: String(bounds.minLongitude),
      maxLongitude: String(bounds.maxLongitude),
    });

    const response = await fetch(`${baseUrl}/api/locations/bounds?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch locations in map area.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bounded locations:", error);
    throw error;
  }
};

export const getNearbyLocations = async (
  latitude: number,
  longitude: number,
  radiusKm: number,
): Promise<NearbyLocationResponse[]> => {
  try {
    const searchParams = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radiusKm: String(radiusKm),
    });

    const response = await fetch(`${baseUrl}/api/locations/nearby?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch nearby locations.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    throw error;
  }
};

export const getPendingLocations = async (): Promise<LocationResponse[]> => {
  return getAdminLocationsByStatus("pending");
};

export const getRejectedLocations = async (): Promise<LocationResponse[]> => {
  return getAdminLocationsByStatus("rejected");
};

//get location by id
export const getLocationById = async (
  id: string,
): Promise<LocationResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch location.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};

//Create new location, token needed in header to verify that user is logged in
export const createLocation = async (
  request: LocationRequest,
): Promise<LocationResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to create location.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

export const getAdminLocationById = async (
  id: string,
): Promise<LocationResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations/admin/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch location.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching admin location:", error);
    throw error;
  }
};

export const updateLocation = async (
  id: string,
  request: LocationRequest,
): Promise<LocationResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to update location.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const updateLocationStatus = async (
  id: string,
  status: LocationStatus,
): Promise<LocationResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to update location status.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating location status:", error);
    throw error;
  }
};

const getAdminLocationsByStatus = async (
  status: "pending" | "rejected",
): Promise<LocationResponse[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/locations/${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to fetch ${status} locations.`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${status} locations:`, error);
    throw error;
  }
};

const getAuthorizationHeader = (): Record<string, string> => {
  const token = localStorage.getItem("trainhereToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

//DELETE
