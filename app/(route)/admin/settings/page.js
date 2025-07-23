"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [theme, setTheme] = useState("light");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [allAdmins, setAllAdmins] = useState([]);

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    setAdmin(adminData);
    setTheme(localStorage.getItem("theme") || "light");
    fetchAllAdmins();
  }, []);

  const fetchAllAdmins = async () => {
    try {
      const res = await axios.get("/api/admin/login");
      setAllAdmins(res.data.admins);
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
    try {
      await axios.post("/api/admin/add", newAdmin);
      alert("New admin added!");
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAllAdmins(); // Refresh
    } catch (err) {
      alert("Error adding admin.");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      await axios.delete(`/api/admin/delete/${id}`);
      alert("Admin deleted.");
      fetchAllAdmins();
    } catch (err) {
      alert("Error deleting admin.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[color:var(--highlight)]">Admin Settings</h1>

      <div className="text-[var(--foreground)] border border-[color:var(--border)] p-4 rounded space-y-2">
        <p><strong>Name:</strong> {admin?.name}</p>
        <p><strong>Email:</strong> {admin?.email}</p>
        <p><strong>Role:</strong> {admin?.role}</p>
      </div>

      <div className="flex items-center gap-4 ">
        <span className="text-sm">Theme:
          <span className="font-bold text-xl ml-2 text-[color:var(--accent)]">{theme}</span>
        </span>
        <button onClick={toggleTheme} className="bg-[color:var(--highlight)] text-[color:var(--background)] px-3 py-1 rounded">
          Toggle Theme
        </button>
      </div>

      {admin?.role === "superadmin" && (
        <>
          <div className="p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Add New Admin</h2>
            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              className="block w-full border p-2 rounded mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="block w-full border p-2 rounded mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="block w-full border p-2 rounded mb-2"
            />
            <button
              onClick={handleAddAdmin}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Add Admin
            </button>
          </div>

          <div className="p-4 rounded shadow mt-6">
            <h2 className="text-lg font-semibold mb-2">All Admins</h2>
            <ul className="space-y-2">
              {allAdmins.map((a) => (
                <li
                  key={a._id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <div>
                    <p className="font-semibold">{a.name} ({a.role})</p>
                    <p className="text-sm text-gray-600">{a.email}</p>
                  </div>
                  <button
                    className="text-red-600 text-sm border border-red-600 px-2 py-1 rounded"
                    onClick={() => handleDeleteAdmin(a._id)}
                    disabled={a.email === admin?.email}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
