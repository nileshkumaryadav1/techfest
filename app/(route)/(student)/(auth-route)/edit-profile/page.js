"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    _id: "",
    festId: "",

    name: "",
    email: "",
    phone: "",
    // password: "",

    college: "",
    year: "",
    branch: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("student"));

    if (!stored) {
      router.push("/login");
      return;
    };

    if (stored) {
      setFormData({
        _id: stored._id || "",
        festId: stored.festId || "",

        name: stored.name || "",
        email: stored.email || "",
        phone: stored.phone || "",
        // password: stored.password || "",

        college: stored.college || "",
        year: stored.year || "",
        branch: stored.branch || "",
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   const res = await fetch(`/api/student/${formData._id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Profile updated successfully!");
      localStorage.setItem("student", JSON.stringify(data.student));
      router.push("/dashboard");
    } else {
      setMessage("❌ Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-[var(--card)] rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <p>ID: {formData._id}</p>
        </div>
        <div>
            <p>ID: {formData.festId}</p>
        </div>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            type="email"
            disabled
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            type="tel"
            disabled
            required
          />
        </div>
        {/* <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            type="password"
            required
          />
        </div> */}
        <div>
          <label className="block mb-1 font-medium">College</label>
          <input
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Year</label>
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            type="tel"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Branch</label>
          <input
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-[var(--background)]"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[var(--accent)] text-white font-semibold hover:opacity-90"
        >
          Save Changes
        </button>
      </form>
      
      {message && <p className="mb-4 text-sm text-green-500">{message}</p>}
    </div>
  );
}
