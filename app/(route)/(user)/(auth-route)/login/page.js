"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("student")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store both token and student info
      console.log(data.student);
      localStorage.setItem("student", JSON.stringify(data.student));

      // Optional success toast (replace with real toast lib in production)
      // alert("Login successful!");

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="md:min-h-screen py-5 flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6 rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--card)] w-full max-w-md transition-all"
      >
        <h2 className="text-2xl font-bold text-center">Student Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition flex justify-center items-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <Link
        href="/register"
        className="mt-6 text-[var(--highlight)] hover:underline text-sm"
      >
        Don&apos;t have an account? Register here.
      </Link>
    </main>
  );
}
