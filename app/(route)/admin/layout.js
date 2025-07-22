// app/admin/layout.js
"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const adminLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "All Events", href: "/admin/events" },
  { name: "Registrations", href: "/admin/users" },
  { name: "Winners", href: "/admin/winners" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();

  // 🔐 Optional: Add your auth check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("admin"));
    if (!user || user.role !== "admin" || user.role !== "superadmin") {
      router.push("/admin/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      <aside className="w-64 p-6 bg-white shadow-lg border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-6">🛠️ Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-blue-600 text-lg font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
