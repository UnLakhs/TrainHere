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
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-(--color-text-secondary)">
            TrainHere
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Your profile
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-(--color-text-secondary)">
            Manage the account connected to your saved training places and
            future location submissions.
          </p>
        </div>

        <div className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl shadow-black/10 sm:p-8">
          {status === "loading" && (
            <p className="text-sm text-(--color-text-secondary)">Loading your profile...</p>
          )}

          {status === "error" && (
            <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {message}
            </p>
          )}

          {status === "success" && user && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-(--color-text-secondary)">Display name</span>
                <span className="text-xl font-semibold text-(--color-text-primary)">
                  {user.displayName}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">Email</p>
                  <p className="mt-2 wrap-break-word font-medium text-(--color-text-primary)">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4">
                  <p className="text-sm text-(--color-text-secondary)">Role</p>
                  <p className="mt-2 font-medium text-(--color-text-primary)">{user.role}</p>
                </div>

                <div className="rounded-md border border-(--color-border) bg-(--color-page) p-4 sm:col-span-2">
                  <p className="text-sm text-(--color-text-secondary)">User ID</p>
                  <p className="mt-2 wrap-break-word font-mono text-sm text-(--color-text-primary)">
                    {user.id}
                  </p>
                </div>
              </div>

              <button
                className="w-full rounded-md border border-(--color-border) px-4 py-2.5 font-semibold text-(--color-text-primary) transition hover:border-red-300 hover:bg-red-400/10 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-(--color-page) sm:w-fit"
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
