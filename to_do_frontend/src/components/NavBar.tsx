"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function NavBar() {
  const { state, logout } = useAuth();

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-gray-900">
          Task Tracker
        </Link>
        <div className="flex items-center gap-3">
          {state.user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {state.user.email}</span>
              <Link href="/todos" className="text-sm text-gray-700 hover:text-blue-600">My Todos</Link>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">
                Log in
              </Link>
              <Link href="/signup" className="text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
