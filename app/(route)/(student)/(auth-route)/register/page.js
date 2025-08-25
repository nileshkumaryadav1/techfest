"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    year: "",
    branch: "",
    phone: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("student")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });

      const data = res.headers.get("content-type")?.includes("application/json")
        ? await res.json()
        : {};

      if (res.ok) {
        alert(`📩 OTP sent to ${form.email || form.phone}`);
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Registration successful!");
        localStorage.setItem("student", JSON.stringify(data.student));
        router.push("/dashboard");
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-5 flex flex-col items-center justify-center px-4 bg-[var(--background)] text-[var(--foreground)]">
      {step === 1 && (
        <form
          onSubmit={sendOtp}
          className="w-full max-w-sm sm:max-w-md p-6 space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-md"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            🎓 Student Registration
          </h2>

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
              required
              className="w-full p-2 rounded-lg bg-transparent border border-[var(--border)] placeholder:text-sm placeholder:text-gray-400"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={verifyOtp}
          className="w-full max-w-sm sm:max-w-md p-6 space-y-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-md"
        >
          <h2 className="text-lg sm:text-xl font-bold text-center">
            🔐 Verify OTP
          </h2>
          <p className="text-sm text-center text-gray-500">
            Enter the OTP sent to <b>{form.email || form.phone}</b>
          </p>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-transparent border border-[var(--border)] placeholder:text-sm placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-4 text-sm text-[var(--secondary)] hover:underline active:text-[var(--accent)]"
      >
        Already registered? Login here →
      </Link>

      <Link
        href="/reset-password"
        className="mt-2 text-sm text-[var(--secondary)] hover:underline active:text-[var(--accent)]"
      >
        Forgot password?
      </Link>
    </main>
  );
}
