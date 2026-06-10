import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  hasAuthToken,
  logoutUser,
  subscribeToAuthChanges,
  type CurrentUserResponse,
} from "../api/auth/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken());
  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(null);

  useEffect(() => {
    async function syncCurrentUser() {
      const hasToken = hasAuthToken();
      setIsAuthenticated(hasToken);

      if (!hasToken) {
        setCurrentUser(null);
        return;
      }

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading navbar user:", error);
        setCurrentUser(null);
      }
    }

    syncCurrentUser();
    return subscribeToAuthChanges(syncCurrentUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-emerald-300"
      : "text-zinc-300 transition hover:text-zinc-50";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 px-6 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-6xl flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="text-sm font-bold uppercase tracking-wide text-emerald-300"
            to="/"
          >
            TrainHere
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">

          {isAuthenticated && (
            <>
              <NavLink className={linkClass} to="/locations/new">
                Submit location
              </NavLink>
              {currentUser?.role === "ADMIN" && (
                <NavLink className={linkClass} to="/admin">
                  Admin
                </NavLink>
              )}
              <NavLink className={linkClass} to="/profile">
                Profile
              </NavLink>
            </>
          )}

          <span className="hidden h-5 w-px bg-zinc-800 sm:block" />

          {isAuthenticated ? (
            <button
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-semibold text-zinc-100 transition hover:border-red-300 hover:bg-red-400/10 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-zinc-950"
              type="button"
              onClick={handleLogout}
            >
              Sign out
            </button>
          ) : (
            <>
              <NavLink className={linkClass} to="/login">
                Sign in
              </NavLink>
              <NavLink
                className="rounded-md bg-emerald-400 px-3 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-950"
                to="/register"
              >
                Create account
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
