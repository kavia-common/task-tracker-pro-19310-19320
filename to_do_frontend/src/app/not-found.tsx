import React from "react";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section
        className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center"
        role="alert"
        aria-live="assertive"
      >
        <h1 className="text-2xl font-semibold mb-2">404 – Page Not Found</h1>
        <p className="text-gray-600">The page you’re looking for doesn’t exist.</p>
      </section>
    </PageShell>
  );
}
