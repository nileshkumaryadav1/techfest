"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("student")) {
      router.push("/dashboard");
    }
  }, [router]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    year: "",
    branch: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Registration successful!");
        localStorage.setItem("student", JSON.stringify(data.student));
        router.push("/dashboard");
      } else {
        alert(data.message || data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="md:min-h-screen py-5 flex flex-col items-center justify-center px-4 bg-[var(--background)] text-[var(--foreground)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">🎓 Student Registration</h2>

        {[
          { name: "name", type: "text", placeholder: "Full Name" },
          { name: "email", type: "email", placeholder: "Email Address" },
          { name: "phone", type: "tel", placeholder: "Phone Number" },
          { name: "college", type: "text", placeholder: "College Name" },
          { name: "year", type: "text", placeholder: "Year (e.g. 2nd Year)" },
          { name: "branch", type: "text", placeholder: "Branch (e.g. CSE)" },
          { name: "password", type: "password", placeholder: "Password" },
        ].map(({ name, type, placeholder }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            required={
              ["name", "email", "phone", "password"].includes(name)
            }
            className="w-full p-2 rounded-lg bg-transparent border border-[var(--border)] placeholder:text-sm placeholder:text-gray-400"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-4 text-sm text-[var(--highlight)] hover:underline"
      >
        Already registered? Login here →
      </Link>
    </main>
  );
}
