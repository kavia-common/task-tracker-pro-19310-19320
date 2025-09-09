"use client";

import NavBar from "@/components/NavBar";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
