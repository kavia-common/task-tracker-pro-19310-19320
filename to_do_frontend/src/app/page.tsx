"use client";

import Link from "next/link";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <PageShell>
      <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold mb-2">Welcome to Task Tracker</h1>
        <p className="text-gray-600 mb-6">
          Manage your to-do list efficiently with tasks, priorities, and due dates.
        </p>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Link
              href="/tasks"
              className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Go to Tasks
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
