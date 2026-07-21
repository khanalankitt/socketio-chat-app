"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-600">
          An unexpected error occurred. Please try again.
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}