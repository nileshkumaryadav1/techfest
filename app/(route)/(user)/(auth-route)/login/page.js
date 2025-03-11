"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard"); // Redirect if already logged in
    }
  }, [session, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (session) return null; // Hide login form if already logged in

  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form
        className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            signIn("credentials", { email, password });
          }}
        >
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-2 mb-2"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded p-2 mb-2"
            name="password"
            required
          />
          <button className="bg-blue-500 text-white w-full p-2 cursor-pointer hover:bg-blue-600">Login</button>
          <p className="text-gray-600 mt-2">Do not have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
