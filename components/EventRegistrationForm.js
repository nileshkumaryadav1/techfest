"use client";
import { useState } from "react";

export default function EventRegistrationForm({ eventId }) {
  const [user, setUser] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/event/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, eventId }),
    });

    const result = await res.json();
    setMessage(result.message || result.error);
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register for the Event</h2>
      <p>Event: {eventId}</p>
      <p>Event Name: {event.name}</p>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-2 mb-2"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-2 mb-2"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white w-full p-2 mt-3 hover:bg-blue-600 cursor-pointer">
          Register
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
}
