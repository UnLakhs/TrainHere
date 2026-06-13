import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  hasAuthToken,
  logoutUser,
  subscribeToAuthChanges,
  type CurrentUserResponse,
} from "../api/auth/auth";

type Theme = "dark" | "light";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken());
  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(
    null,
  );
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("trainhereTheme", theme);
  }, [theme]);

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
      ? "text-[var(--color-text-primary)]"
      : "text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]";

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-6 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-6xl flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-primary)]"
            to="/"
          >
            TrainHere
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          {isAuthenticated && (
            <>
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

          <button
            aria-label={`Switch to ${nextTheme} theme`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] transition hover:bg-[var(--color-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-indicator)] focus:ring-offset-2 focus:ring-offset-[var(--color-page)]"
            onClick={() => setTheme(nextTheme)}
            title={`Switch to ${nextTheme} theme`}
            type="button"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <span className="hidden h-5 w-px bg-[var(--color-border)] sm:block" />

          {isAuthenticated ? (
            <button
              className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-red-300/60 hover:bg-red-400/10 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-[var(--color-page)]"
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
                className="rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-indicator)] focus:ring-offset-2 focus:ring-offset-[var(--color-page)]"
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

const getStoredTheme = (): Theme => {
  const storedTheme = localStorage.getItem("trainhereTheme");
  return storedTheme === "light" ? "light" : "dark";
};

const SunIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M20.99 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 20.99 12.79Z" />
  </svg>
);

export default Navbar;
