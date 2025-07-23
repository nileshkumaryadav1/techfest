"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Users, Trophy, Settings } from "lucide-react";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "All Events", href: "/admin/events", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Registrations", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { name: "Winners", href: "/admin/winners", icon: <Trophy className="w-5 h-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // 🔐 Auth check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("admin"));
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      router.push("/admin/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-[color:var(--card)] border-r border-[color:var(--border)] shadow-lg p-6">
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck className="w-6 h-6 text-[color:var(--highlight)]" />
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="space-y-3">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                    : "hover:bg-[color:var(--accent)]/10 hover:text-[color:var(--accent)]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
