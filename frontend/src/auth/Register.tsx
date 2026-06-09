import { useState } from "react";
import { registerUser, saveAuthToken } from "../api/auth/auth";


const Register = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const displayName = formData.get("displayName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");
      const authResponse = await registerUser(displayName, email, password, confirmPassword);
      saveAuthToken(authResponse.token);
      setStatus("success");
      setMessage("Account created successfully.");
      form.reset();
    } catch (error) {
      console.error("Error registering user:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not create account. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            TrainHere
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Create your training profile.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
            Save favorite spots, add new training locations, and help others
            find reliable places to train.
          </p>
        </div>

        <form
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Register</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Start with an email and a secure password.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-200" htmlFor="displayName">
                Display name
              </label>
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                id="displayName"
                name="displayName"
                placeholder="Apostolos"
                type="text"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-200" htmlFor="email">
                Email
              </label>
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                id="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-200" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                id="password"
                name="password"
                placeholder="At least 8 characters"
                type="password"
                minLength={8}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-zinc-200"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repeat your password"
                type="password"
                minLength={8}
                required
              />
            </div>

            {message && (
              <p
                className={
                  status === "success"
                    ? "rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
                    : "rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                }
              >
                {message}
              </p>
            )}

            <button
              className="rounded-md bg-emerald-400 px-4 py-2.5 font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Register;
