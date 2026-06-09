import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, type CurrentUserResponse } from "../api/auth/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const currentUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        setStatus("success");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        logoutUser();
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not load your profile.");
        setTimeout(() => navigate("/login"), 900);
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            TrainHere
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Your profile
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
            Manage the account connected to your saved training places and
            future location submissions.
          </p>
        </div>

        <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 sm:p-8">
          {status === "loading" && (
            <p className="text-sm text-zinc-300">Loading your profile...</p>
          )}

          {status === "error" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {message}
            </p>
          )}

          {status === "success" && user && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-400">Display name</span>
                <span className="text-xl font-semibold text-zinc-50">
                  {user.displayName}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm text-zinc-400">Email</p>
                  <p className="mt-2 wrap-break-word font-medium text-zinc-100">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-sm text-zinc-400">Role</p>
                  <p className="mt-2 font-medium text-zinc-100">{user.role}</p>
                </div>

                <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 sm:col-span-2">
                  <p className="text-sm text-zinc-400">User ID</p>
                  <p className="mt-2 wrap-break-word font-mono text-sm text-zinc-100">
                    {user.id}
                  </p>
                </div>
              </div>

              <button
                className="w-full rounded-md border border-zinc-700 px-4 py-2.5 font-semibold text-zinc-100 transition hover:border-red-300 hover:bg-red-400/10 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-zinc-900 sm:w-fit"
                type="button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;
