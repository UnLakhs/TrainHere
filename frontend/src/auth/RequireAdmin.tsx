import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser, type CurrentUserResponse } from "../api/auth/auth";

const RequireAdmin = () => {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setStatus("success");
      } catch (error) {
        console.error("Error checking admin access:", error);
        setStatus("error");
      }
    }

    loadUser();
  }, []);

  if (status === "loading") {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
        <p className="mx-auto max-w-5xl text-sm text-zinc-300">
          Checking access...
        </p>
      </main>
    );
  }

  if (status === "error") {
    return <Navigate replace to="/login" />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};

export default RequireAdmin;
