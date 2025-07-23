"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Trophy,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";

// Admin Navigation Links
const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Add Items", href: "/admin/homepage", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "All Events", href: "/admin/events", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Registrations", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { name: "Winners", href: "/admin/winners", icon: <Trophy className="w-5 h-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Auth Check
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
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen text-[color:var(--foreground)] bg-[color:var(--background)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 min-h-screen bg-[color:var(--card)] border-r border-[color:var(--border)] shadow-lg p-4 flex flex-col`}
      >
        {/* Toggle + Logo */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[color:var(--highlight)]" />
            {sidebarOpen && <h2 className="text-xl font-bold">Admin</h2>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[color:var(--accent)]">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                    : "hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)]"
                }`}
              >
                {link.icon}
                {sidebarOpen && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile & Logout */}
        <div className="mt-4 border-t pt-4 border-[color:var(--border)]">
          {sidebarOpen && adminUser && (
            <div className="mb-2 text-xs">
              <div className="font-semibold">{adminUser.name}</div>
              <div className="text-[color:var(--accent)] capitalize">{adminUser.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
