"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    router.replace("/tasks");
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
      router.replace("/tasks");
    } catch (err: unknown) {
      const { extractErrorMessage } = await import("@/lib/error");
      const msg = extractErrorMessage(err, "Login failed");
      setError(msg);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="grid gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </PageShell>
  );
}
