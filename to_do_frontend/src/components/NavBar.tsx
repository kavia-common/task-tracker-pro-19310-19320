"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { isAuthenticated, logout, loading } = useAuth();

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg text-gray-900">
            Task Tracker
          </Link>
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-3 text-sm">
              <Link href="/tasks" className="text-gray-700 hover:text-gray-900">
                Tasks
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                Profile
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => !loading && logout()}
              className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
              disabled={loading}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
