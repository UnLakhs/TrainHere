const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type LocationResponse = {
  id: string;
  name: string;
  type: "GYM" | "CALISTHENICS_PARK";
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
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

//Create new location, token needed in header to verify that user is logged in, and also to check if user has the right role to create a location (ADMIN or TRAINER)
export const createLocation = async (
  request: LocationRequest,
): Promise<LocationResponse> => {
  try {
    const token = localStorage.getItem("trainhereToken");

    const response = await fetch(`${baseUrl}/api/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export const updateLocationStatus = async (
  id: string,
  status: LocationStatus,
): Promise<LocationResponse> => {
  try {
    const token = localStorage.getItem("trainhereToken");

    const response = await fetch(`${baseUrl}/api/locations/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const token = localStorage.getItem("trainhereToken");

    const response = await fetch(`${baseUrl}/api/locations/${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
//PUT
//DELETE
