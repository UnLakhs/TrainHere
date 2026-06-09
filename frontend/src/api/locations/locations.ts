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

//get location by id
export const getLocationById = async (id: string): Promise<LocationResponse> => {
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
