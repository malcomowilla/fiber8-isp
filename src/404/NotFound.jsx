import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-green-50 px-6 text-center dark:bg-gray-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/30 blur-3xl dark:bg-green-500/20"
      />

      <div className="relative max-w-md">
        <p
          className="select-none text-8xl font-extrabold tracking-tight text-green-600 sm:text-9xl dark:text-green-400"
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-50">
          Page not found
        </h1>

        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or may have been moved.
          Check the address or head back to a page that does.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50 sm:w-auto dark:bg-green-500 dark:text-gray-950 dark:hover:bg-green-400 dark:focus-visible:ring-offset-gray-950"
          >
            Go to homepage
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center justify-center rounded-lg border border-green-600/30 px-5 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50 sm:w-auto dark:border-green-400/30 dark:text-green-300 dark:hover:bg-green-400/10 dark:focus-visible:ring-offset-gray-950"
          >
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}