"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  User,
  Menu,
  X,
  Presentation,
} from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={22} /> },
    { href: "/events", label: "Events", icon: <Calendar size={22} /> },
    { href: "/registered-event", label: "Enrolled", icon: <Presentation size={22} /> },
    { href: "/dashboard", label: "Dashboard", icon: <User size={22} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 z-50 shadow-md">
      <div className="flex justify-between items-center mx-auto px-5 md:px-20 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          TechFest&apos;25
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-3 items-center">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </div>

        {/* Hamburger Menu */}
        <button
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="sm:hidden text-white"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 sm:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <span className="text-lg font-semibold text-white">TechFest'25</span>
          <button
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="text-white"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex flex-col px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavItemMobile
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

// Desktop Nav Item
const NavItem = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
      active
        ? "bg-gray-800 text-blue-400"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`}
  >
    {icon}
    {label}
  </Link>
);

// Mobile Nav Item
const NavItemMobile = ({ href, icon, label, active, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition ${
      active
        ? "bg-gray-700 text-blue-400"
        : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
