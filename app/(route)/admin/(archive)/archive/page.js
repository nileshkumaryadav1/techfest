"use client";

import { useEffect, useState } from "react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminArchivePage() {
  const [archives, setArchives] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    name: "",
    month: "",
    year: "",
    theme: "",
    tagline: "",
    description: "",
    startDate: "",
    endDate: "",
    brochureUrl: "",
    venue: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch archives
  const fetchArchives = async () => {
    try {
      const res = await fetch("/api/admin/fest-archive");
      if (!res.ok) throw new Error("Failed to fetch archives");
      const data = await res.json();
      setArchives(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Create or update archive
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        month: Number(form.month),
        year: Number(form.year),
      };
      const method = form._id ? "PUT" : "POST";

      const res = await fetch("/api/admin/fest-archive", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save archive");
      }

      const data = await res.json();

      if (form._id) {
        setArchives((prev) => prev.map((a) => (a._id === data._id ? data : a)));
      } else {
        setArchives((prev) => [...prev, data]);
      }

      setForm({
        _id: null,
        name: "",
        month: "",
        year: "",
        theme: "",
        tagline: "",
        description: "",
        startDate: "",
        endDate: "",
        brochureUrl: "",
        venue: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete archive using same route
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this archive?")) return;

    try {
      const res = await fetch("/api/admin/fest-archive", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });

      if (!res.ok) throw new Error("Failed to delete archive");
      setArchives((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (archive) => {
    setForm({
      _id: archive._id,
      name: archive.name || "",
      month: archive.month || "",
      year: archive.year || "",
      theme: archive.theme || "",
      tagline: archive.tagline || "",
      description: archive.description || "",
      startDate: archive.startDate || "",
      endDate: archive.endDate || "",
      brochureUrl: archive.brochureUrl || "",
      venue: archive.venue || "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Admin Archive Page
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
      >
        {Object.keys(form)
          .filter((k) => k !== "_id")
          .map((key) => {
            const type = key.includes("Date")
              ? "date"
              : key === "month" || key === "year"
              ? "number"
              : "text";
            const min = key === "month" ? 1 : key === "year" ? 2000 : undefined;
            const max =
              key === "month" ? 12 : key === "year" ? 2099 : undefined;
            return (
              <input
                key={key}
                type={type}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={form[key]}
                onChange={handleChange}
                required
                min={min}
                max={max}
                className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            );
          })}

        <button
          type="submit"
          disabled={loading}
          className="col-span-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          {loading
            ? "Saving..."
            : form._id
            ? "Update Archive"
            : "Create Archive"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <h2 className="text-2xl font-semibold text-center mb-6">
        Archives ({archives.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {archives.map((archive) => (
          <div
            key={archive._id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {archive.name}
            </h3>
            <p className="mb-1">
              <strong>Month:</strong> {monthNames[archive.month - 1]} &nbsp;{" "}
              <strong>Year:</strong> {archive.year}
            </p>
            {archive.theme && (
              <p className="mb-1">
                <strong>Theme:</strong> {archive.theme}
              </p>
            )}
            {archive.tagline && (
              <p className="mb-1">
                <strong>Tagline:</strong> {archive.tagline}
              </p>
            )}
            {archive.description && (
              <p className="mb-1">{archive.description}</p>
            )}
            {archive.startDate && archive.endDate && (
              <p className="mb-1">
                <strong>Dates:</strong> {archive.startDate} – {archive.endDate}
              </p>
            )}
            {archive.venue && (
              <p className="mb-1">
                <strong>Venue:</strong> {archive.venue}
              </p>
            )}
            {archive.brochureUrl && (
              <p className="mb-2">
                <a
                  href={archive.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Brochure
                </a>
              </p>
            )}
            <p className="mb-2">
              <strong>Events:</strong> {archive.events?.length || 0}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(archive)}
                className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-semibold transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(archive._id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
