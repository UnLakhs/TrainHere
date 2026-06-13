import { Link } from "react-router-dom";
import CreateLocationForm from "./CreateLocationForm";

const CreateLocationPage = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-(--color-page) px-6 py-10 text-(--color-text-primary)">
      <section className="mx-auto max-w-5xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) transition over:text-(--color-text-primary)"
          to="/"
        >
          <span aria-hidden="true">←</span>
          Back to locations
        </Link>

        <div className="mt-6">
          <h1 className="mt-3 text-4xl font-bold leading-tight">
            Add a training location.
          </h1>
          <p className="mt-4 max-w-2xl text-(--color-text-secondary)">
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
