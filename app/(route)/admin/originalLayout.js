"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Auth check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("admin"));
    if (pathname === "/admin/login") {
      setAuthChecked(true);
      return;
    }
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      router.push("/admin/login");
    } else {
      setAdminUser(user);
      setAuthChecked(true);
    }
  }, [pathname, router]);

  // ✅ Close sidebar with ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    try {
      // Confirm logout
      if (!confirm("Are you sure you want to logout?")) return;

      // Clear stored session/token
      localStorage.removeItem("admin");

      // Clear adminUser state
      setAdminUser(null);

      // Redirect to login with replace to prevent going back
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen text-[color:var(--foreground)] bg-[color:var(--background)]">
        Loading...
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
