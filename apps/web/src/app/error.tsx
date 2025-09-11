"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-200">
      <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
      >
        Try again
      </button>
    </div>
  );
}
