import { Link } from "react-router-dom";
import LocationList from "./LocationList";

const HomePage = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-50">
      <section className="border-b border-zinc-800 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              TrainHere
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Find places to train nearby.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              Browse gyms and calisthenics parks, compare the essentials, and
              open a location when you need the full details.
            </p>
          </div>

          <Link
            className="inline-flex w-full justify-center rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-950 sm:w-fit"
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
