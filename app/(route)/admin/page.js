import Link from "next/link";
import React from "react";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-xl text-center">
        <h2 className="text-3xl font-bold text-[color:var(--foreground)] mb-6">
          Admin Panel
        </h2>

        <Link
          href="/admin/homepage"
          className="inline-block px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
          Manage Homepage Data
        </Link>
      </div>
    </div>
  );
}
