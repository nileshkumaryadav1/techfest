"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("admin")) {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data.admin));
      router.replace("/admin");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="md:min-h-screen p-10 flex-col space-y-4 flex items-center justify-center bg-[var(--background)] px-4">
      <Link
        // onClick={() => router.push("/")}
        href="/"
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 shadow-md transition-all duration-200 active:scale-95 w-full sm:w-auto"
      >
        <Home className="w-4 h-4" />
        <span>Go to User Home</span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            Admin Login
          </h1>
          <button
            // onClick={() => router.push("/")}
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Shield
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-sm px-4 py-2 rounded-lg mb-4 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-white/90"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-white/90"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--highlight)] text-white font-semibold shadow-lg transition-transform transform hover:scale-[1.02] active:scale-95"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
