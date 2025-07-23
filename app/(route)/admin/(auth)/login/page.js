"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("admin")) {
      router.push("/admin");
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
      router.push("/admin");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-xl shadow-lg p-8 border border-[var(--border)]">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)] mb-6">
          Admin Login
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--accent)] hover:bg-[var(--highlight)] text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
