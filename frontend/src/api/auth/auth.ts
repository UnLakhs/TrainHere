//This file is to fetch methods related to auth

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type AuthResponse = {
  userId: string;
  email: string;
  displayName: string;
  token: string;
};

export type CurrentUserResponse = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

//register users
export async function registerUser(
  displayName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthResponse> {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ displayName, email, password, confirmPassword }),
  });

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response);
    throw new Error(errorMessage);
  }

  return await response.json();
}

//login users
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response);
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const token = localStorage.getItem("trainhereToken");

  if (!token) {
    throw new Error("You need to sign in first.");
  }

  const response = await fetch(`${baseUrl}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response);
    throw new Error(errorMessage);
  }

  return await response.json();
}

export function logoutUser() {
  localStorage.removeItem("trainhereToken");
}

async function getErrorMessage(response: Response) {
  const fallbackMessage = "Something went wrong. Please try again.";

  try {
    const body = await response.json();
    return body.detail ?? body.message ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}
