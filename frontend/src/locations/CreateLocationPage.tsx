import { Link } from "react-router-dom";
import CreateLocationForm from "./CreateLocationForm";

const CreateLocationPage = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-10 text-zinc-50">
      <section className="mx-auto max-w-5xl">
        <Link
          className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          to="/"
        >
          Back to locations
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Submit a place
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">
            Add a training location.
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Submitted locations are reviewed before they appear publicly, so
            add the clearest details you have.
          </p>
        </div>
      </section>

      <CreateLocationForm />
    </main>
  );
};

export default CreateLocationPage;
