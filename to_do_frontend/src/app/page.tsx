import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <section className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Organize your day with Task Tracker
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Create, track, and complete your tasks with a clean and responsive interface.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="px-5 py-3 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
