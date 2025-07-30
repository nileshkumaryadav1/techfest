"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [theme, setTheme] = useState("light");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    setAdmin(adminData);
    setTheme(localStorage.getItem("theme") || "light");
    fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      const res = await axios.get("/api/admin/login");
      setAllAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/admin/add", newAdmin);
      alert("✅ New admin added!");
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAllAdmins();
    } catch (err) {
      alert("❌ Failed to add admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id, email) => {
    if (email === admin?.email) {
      alert("⚠️ You cannot delete yourself.");
      return;
    }

    if (!confirm("Are you sure you want to delete this admin?")) return;

    setLoading(true);
    try {
      await axios.delete(`/api/admin/delete/${id}`);
      fetchAllAdmins();
    } catch (err) {
      alert("❌ Failed to delete admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <div className="md:p-6 md:space-y-8 space-y-3 text-[color:var(--foreground)]">
      <div className="md:text-3xl text-xl text-center font-bold text-[color:var(--highlight)]">Admin Settings</div>

      {/* Admin Details */}
      <div className="border border-[color:var(--border)] md:p-4 p-3 rounded-xl bg-white/5 backdrop-blur">
        <p><strong>Name:</strong> {admin?.name}</p>
        <p><strong>Email:</strong> {admin?.email}</p>
        <p><strong>Role:</strong> {admin?.role}</p>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Theme:{" "}
          <span className="font-bold text-xl text-[color:var(--accent)] ml-1">{theme}</span>
        </span>
        <button
          onClick={toggleTheme}
          className="bg-[color:var(--highlight)] text-[color:var(--background)] px-4 md:py-2 py-1 rounded-lg font-medium hover:scale-105 transition-all"
        >
          Toggle Theme
        </button>
      </div>

      {/* Superadmin-only Actions */}
      {admin?.role === "superadmin" && (
        <>
          {/* Add Admin */}
          <div className="bg-white/5 border border-[color:var(--border)] md:p-6 p-4 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold text-[color:var(--accent)]">➕ Add New Admin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="p-2 border rounded bg-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="p-2 border rounded bg-transparent"
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="p-2 border rounded bg-transparent"
              />
            </div>
            <button
              onClick={handleAddAdmin}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:scale-105 transition"
            >
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </div>

          {/* List All Admins */}
          <div className="border border-[color:var(--border)] md:p-6 p-2 rounded-xl md:space-y-4 bg-white/5">
            <h2 className="text-lg text-center font-semibold text-[color:var(--accent)]">👥 All Admins</h2>
            <ul className="divide-y divide-[color:var(--border)]">
              {allAdmins.map((a) => (
                <li key={a._id} className="py-2">
                  <div>
                    <p className="font-medium">{a.name} ({a.role})</p>
                    <p className="text-sm text-gray-400">{a.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAdmin(a._id, a.email)}
                    disabled={loading || a.email === admin?.email}
                    className="text-red-600 border border-red-600 px-3 py-1 rounded text-sm hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Logout */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:scale-105 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
