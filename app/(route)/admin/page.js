"use client";

import Link from "next/link";
import React from "react";
import { Home, Menu, ShieldCheck } from "lucide-react";
// import { useRouter } from "next/router";

export default function AdminPage() {
  // const router = useRouter();
  return (
    <main className="md:min-h-screen flex items-center justify-center bg-[color:var(--background)] px-4 py-5">
      <div
        className="w-full max-w-md md:p-10 p-5 rounded-2xl border border-[color:var(--border)] 
        bg-[color:var(--card)]/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] 
        text-center space-y-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      >
        {/* Icon + Heading */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-full bg-[color:var(--highlight)]/10 border border-[color:var(--highlight)]/20">
            <ShieldCheck className="w-12 h-12 text-[color:var(--highlight)] animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--foreground)] tracking-tight">
            Admin Control Panel
          </h1>
          <p className="text-[color:var(--secondary)] text-sm max-w-sm">
            For Authorized Access Only — Securely Manage & Power the Fest 🚀
          </p>
        </div>

        {/* Info Note */}
        <p className="text-sm text-[color:var(--secondary)] border-t border-[color:var(--border)] pt-4 italic">
          All navigation is available in the left sidebar / menu{" "}
          <button
            // onClick={}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[color:var(--foreground)] hover:text-white bg-[color:var(--background)] hover:bg-[var(--accent)] backdrop-blur-lg border border-[color:var(--border)] shadow-md transition-all duration-200 active:scale-95 w-full"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </p>

        <p>OR</p>

        <Link
          // onClick={() => router.push("/")}
          href={"/"}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[color:var(--foreground)] hover:text-white bg-[color:var(--background)] hover:bg-[var(--accent)] backdrop-blur-lg border border-[color:var(--border)] shadow-md transition-all duration-200 active:scale-95 w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          <span>Go to User Side</span>
        </Link>
      </div>
    </main>
  );
}
