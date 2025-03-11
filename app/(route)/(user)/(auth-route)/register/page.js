"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const result = await res.json();
    setMessage(result.message || result.error);
    if(result.message === "User registered successfully") router.push("/login");
    
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-2"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white w-full p-2 mt-3 mb-3 hover:bg-blue-600 cursor-pointer">Register</button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <p>Already have an account?<Link href="/login" className="text-blue-500 hover:underline">Login</Link></p>
      </form>
    </div>
  );
}
