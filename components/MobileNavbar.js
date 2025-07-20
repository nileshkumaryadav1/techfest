"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Trophy,
  User,
} from "lucide-react"; // or use any 4 icons you like

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/certificate", label: "Certificate", icon: Trophy },
  { href: "/dashboard", label: "Profile", icon: User },
];

const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full sm:hidden z-50 border-t border-[color:var(--border)] bg-[color:var(--background)] backdrop-blur shadow-md">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center text-xs px-4 py-1 transition-all duration-200 ease-in-out ${
                isActive
                  ? "text-[color:var(--accent)] scale-105 bg-[color:var(--border)] rounded-full"
                  : "text-[color:var(--secondary)] hover:text-[color:var(--highlight)]"
              }`}
            >
              <Icon size={22} />
              {/* Optional label */}
              {/* <span className="mt-1 text-[10px]">{label}</span> */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
