"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "@/components/custom/myself/LoadingSkeleton";
import LoadingSkeletonSmall from "@/components/custom/myself/LoadingSkeletonSmall";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Validate admin directly with DB
  const validateAdmin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("admin"));

      // Skip check if already on login page
      if (pathname === "/admin/login") {
        setAuthChecked(true);
        return;
      }

      // No localStorage user → redirect
      if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        localStorage.removeItem("admin");
        router.replace("/admin/login");
        return;
      }

      // Fetch all admins from DB
      const res = await axios.get("/api/admin/login");
      const admins = res.data.admins || [];

      // Check if localStorage admin exists in DB
      const match = admins.find((a) => a.email === user.email);

      if (!match) {
        // ❌ Not in DB → logout
        localStorage.removeItem("admin");
        router.replace("/admin/login");
        return;
      }

      // ✅ Valid admin
      setAdminUser(user);
      setAuthChecked(true);
    } catch (err) {
      console.error("Admin validation failed:", err);
      localStorage.removeItem("admin");
      router.replace("/admin/login");
    }
  };

  // Run validation on mount + pathname change
  useEffect(() => {
    validateAdmin();
  }, [pathname]);

  // ✅ Close sidebar with ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("admin");
    setAdminUser(null);
    router.replace("/admin/login");
  };

  if (!authChecked) {
    return (
      <div className="flex flex-col justify-center items-center px-6 py-10 gap-2 text-[color:var(--foreground)] bg-[color:var(--background)]">
        <LoadingSkeletonSmall />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[var(--card)] shadow-xl transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:shadow-none`}
        aria-hidden={!sidebarOpen}
      >
        <AdminSidebar
          adminUser={adminUser}
          handleLogout={handleLogout}
          closeSidebar={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
        />
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar (mobile only) */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background)] md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-2 rounded hover:bg-[var(--accent)]/10 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          {/* Logout button */}
          {!adminUser ? (
            <Link
              href="/admin/login"
              className="text-sm border border-[var(--border)] rounded px-2 py-1"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500 text-sm border border-[var(--border)] rounded px-2 py-1"
            >
              Logout
            </button>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[color:var(--background)] backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
