import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveAuthToken } from "../api/auth/auth";

const Login = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const labelClass = "text-sm font-medium text-(--color-text-primary)";
  const inputClass =
    "rounded-md border border-(--color-border) bg-(--color-elevated) px-3 py-2.5 text-(--color-text-primary) outline-none transition placeholder:text-(--color-text-tertiary) focus:border-(--color-accent-indicator) focus:ring-2 focus:ring-(--color-accent-indicator)/20";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      setStatus("loading");
      setMessage("");
      const authResponse = await loginUser(email, password);
      saveAuthToken(authResponse.token);
      setStatus("success");
      setMessage("Signed in successfully.");
      setTimeout(() => navigate("/"), 600);
    } catch (error) {
      console.error("Error logging in user:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not sign in. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-(--color-text-secondary)">
            TrainHere
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Welcome back to your training map.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-(--color-text-secondary)">
            Sign in to manage saved spots, submit new locations, and keep your
            training notes close wherever you go.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-2xl shadow-black/10 sm:p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm text-(--color-text-secondary)">
              Use the email and password connected to your account.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input
                className={inputClass}
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass} htmlFor="password">
                Password
              </label>
              <input
                className={inputClass}
                id="password"
                name="password"
                placeholder="Your password"
                type="password"
                required
              />
            </div>

            {message && (
              <p
                className={
                  status === "success"
                    ? "rounded-md border border-(--color-accent-indicator)/30 bg-(--color-accent-indicator)/10 px-3 py-2 text-sm text-(--color-text-primary)"
                    : "rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                }
              >
                {message}
              </p>
            )}

            <button
              className="rounded-md bg-(--color-accent) px-4 py-2.5 font-semibold text-(--color-accent-text) transition hover:bg-(--color-accent-hover) focus:outline-none focus:ring-2 focus:ring-(--color-accent-indicator) focus:ring-offset-2 focus:ring-offset-(--color-page) disabled:cursor-not-allowed disabled:bg-(--color-elevated) disabled:text-(--color-text-tertiary)"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
