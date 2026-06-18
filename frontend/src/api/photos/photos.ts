const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type PhotoStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LocationPhotoResponse = {
  id: string;
  locationId: string;
  locationName: string;
  uploadedById: string | null;
  uploadedByDisplayName: string | null;
  publicUrl: string;
  caption: string | null;
  contentType: string;
  sizeBytes: number;
  status: PhotoStatus;
  createdAt: string;
};

export const getApprovedLocationPhotos = async (
  locationId: string,
): Promise<LocationPhotoResponse[]> => {
  const response = await fetch(`${baseUrl}/api/locations/${locationId}/photos`);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to fetch location photos.");
  }

  return await response.json();
};

export const uploadLocationPhoto = async (
  locationId: string,
  file: File,
  caption: string,
): Promise<LocationPhotoResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  if (caption.trim()) {
    formData.append("caption", caption.trim());
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/locations/${locationId}/photos`, {
      method: "POST",
      headers: {
        ...getAuthorizationHeader(),
      },
      body: formData,
    });
  } catch {
    throw new Error("Could not reach the backend while uploading the photo. Check that the backend is running and restart it if needed.");
  }

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to upload photo.");
  }

  return await response.json();
};

export const getPendingPhotos = async (): Promise<LocationPhotoResponse[]> => {
  return getPhotosByStatus("pending");
};

export const getRejectedPhotos = async (): Promise<LocationPhotoResponse[]> => {
  return getPhotosByStatus("rejected");
};

export const updatePhotoStatus = async (
  photoId: string,
  status: PhotoStatus,
): Promise<LocationPhotoResponse> => {
  const response = await fetch(`${baseUrl}/api/photos/${photoId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to update photo status.");
  }

  return await response.json();
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/photos/${photoId}`, {
    method: "DELETE",
    headers: {
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to delete photo.");
  }
};

export const getPhotoUrl = (publicUrl: string) => {
  if (publicUrl.startsWith("http")) {
    return publicUrl;
  }

  return `${baseUrl}${publicUrl}`;
};

const getPhotosByStatus = async (
  status: "pending" | "rejected",
): Promise<LocationPhotoResponse[]> => {
  const response = await fetch(`${baseUrl}/api/photos/${status}`, {
    headers: {
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to fetch ${status} photos.`);
  }

  return await response.json();
};

const getAuthorizationHeader = (): Record<string, string> => {
  const token = localStorage.getItem("trainhereToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
