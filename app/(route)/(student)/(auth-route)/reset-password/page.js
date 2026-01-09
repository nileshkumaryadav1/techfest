"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Get OTP
  const handleGetOTP = async () => {
    if (!email) return setMessage("Please enter your email.");
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "reset" }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStep(2);
      setMessage("✅ OTP sent! Check your email.");
    } else {
      setMessage(data.message || "❌ Error sending OTP.");
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword)
      return setMessage("Please fill all fields.");

    if (newPassword !== confirmPassword)
      return setMessage("Passwords do not match.");

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(data.message || "❌ Error resetting password.");
    }
  };

  return (
    <div className="max-w-md my-32 p-8 m-4 border border-[color:var(--border)] rounded-xl shadow-lg bg-[var(--background)]">
      <h1 className="text-3xl font-bold mb-6 text-center text-[color:var(--foreground)]">
        Reset Password
      </h1>

      {/* Step guide */}
      <ol className="mb-6 list-decimal list-inside text-[color:var(--secondary)]">
        {step === 1 && (
          <>
            <li>Enter your registered email.</li>
            <li>Click (Get OTP) to receive a one-time code in your email.</li>
          </>
        )}
        {step === 2 && (
          <>
            <li>Enter the OTP you received.</li>
            <li>Set your new password and confirm it.</li>
            <li>Click - Reset Password - to complete the process.</li>
          </>
        )}
      </ol>

      {message && (
        <p
          className={`mb-4 p-2 rounded ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGetOTP}
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full p-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
      <p className="mt-4 text-[var(--secondary)] hover:underline text-sm active:text-[var(--accent)]">
        <Link href="/register">Don&apos;t have an account? Register here.</Link>
      </p>
      <p className="my-2 text-[var(--secondary)] hover:underline text-sm active:text-[var(--accent)]">
        <Link href="/login">Already registered? Login here →</Link>
      </p>
    </div>
  );
}
