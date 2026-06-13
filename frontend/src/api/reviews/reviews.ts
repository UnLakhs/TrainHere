const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type ReviewResponse = {
  id: string;
  locationId: string;
  userId: string;
  displayName: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  ownedByCurrentUser: boolean;
};

export type ReviewRequest = {
  rating: number;
  title: string;
  comment: string;
};

export const getLocationReviews = async (
  locationId: string,
): Promise<ReviewResponse[]> => {
  const response = await fetch(`${baseUrl}/api/locations/${locationId}/reviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to fetch reviews.");
  }

  return await response.json();
};

export const createReview = async (
  locationId: string,
  request: ReviewRequest,
): Promise<ReviewResponse> => {
  const response = await fetch(`${baseUrl}/api/locations/${locationId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to create review.");
  }

  return await response.json();
};

export const updateReview = async (
  reviewId: string,
  request: ReviewRequest,
): Promise<ReviewResponse> => {
  const response = await fetch(`${baseUrl}/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to update review.");
  }

  return await response.json();
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to delete review.");
  }
};

const getAuthorizationHeader = (): Record<string, string> => {
  const token = localStorage.getItem("trainhereToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
