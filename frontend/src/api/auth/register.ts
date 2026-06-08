//This file is to fetch methods related to auth

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function registerUser(
  displayName: string,
  email: string,
  password: string,
  confirmPassword: string,
) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName, email, password, confirmPassword }),
    });

    if (!response.ok) {
      throw new Error("Error registering user");
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
