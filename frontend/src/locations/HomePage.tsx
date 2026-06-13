import { Link } from "react-router-dom";
import LocationList from "./LocationList";

const HomePage = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--color-page)] text-[var(--color-text-primary)]">
      <section className="border-b border-[var(--color-border)] px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              TrainHere
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Find places to train nearby.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base">
              Browse gyms and calisthenics parks, compare the essentials, and
              open a location when you need the full details.
            </p>
          </div>

          <Link
            className="inline-flex w-full justify-center rounded-md bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-text)] transition hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-indicator)] focus:ring-offset-2 focus:ring-offset-[var(--color-page)] sm:w-fit"
            to="/locations/new"
          >
            Add location
          </Link>
        </div>
      </section>

      <LocationList />
    </main>
  );
};

export default HomePage;
