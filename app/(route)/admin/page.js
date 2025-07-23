"use client";

import Link from "next/link";
import React from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[color:var(--background)] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-[0_4px_24px_rgba(0,0,0,0.1)] text-center space-y-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <ShieldCheck className="w-10 h-10 text-[color:var(--highlight)] animate-bounce" />
          <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
            Admin Control Panel
          </h1>
          <p className="text-[color:var(--secondary)] text-sm">
            For Authorized Access Only — Manage & Power the Fest 🚀
          </p>
        </div>

        <Link
          href="/admin/homepage"
          className="text-[color:var(--highlight)] hover:text-[color:var(--accent)] flex items-center gap-2 border border-[color:var(--border)] px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
        >
          <Sparkles className="w-5 h-5" />
          Add New Items (Events, Sponsors, Highlights)
        </Link>
      </div>
    </main>
  );
}
