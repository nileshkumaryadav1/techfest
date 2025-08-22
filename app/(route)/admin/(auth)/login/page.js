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
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("admin")) {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data.admin));
      router.replace("/admin");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="md:min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[var(--background)] text-[var(--foreground)]">
      {/* Back to Home */}
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:text-[var(--foreground)] border border-[var(--border)] shadow transition-all active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>User Home</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 backdrop-blur-xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Admin Login
          </h1>
          <button className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 border border-[var(--accent)]/30 transition">
            <ShieldCheck className="w-4 h-4" />
            Secure
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
              className="block text-sm font-medium mb-1 text-[var(--foreground)]/90"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/40 backdrop-blur-md text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-[var(--foreground)]/90"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/40 backdrop-blur-md text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--highlight)] text-white font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
