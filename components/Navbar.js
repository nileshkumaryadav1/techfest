"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 py-3 shadow-md z-50">
      <div className="flex justify-between items-center max-w-5xl mx-auto px-6">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-100">TechFest&apos;25</div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex space-x-6">
          <NavItem href="/" icon={<Home size={24} />} label="Home" active={pathname === "/"} />
          <NavItem href="/events" icon={<Calendar size={24} />} label="Events" active={pathname === "/event"} />
          <NavItem href="/profile" icon={<User size={24} />} label="Profile" active={pathname === "/profile"} />
        </div>

        {/* Mobile Hamburger Icon */}
        <button onClick={() => setIsOpen(!isOpen)} className="sm:hidden text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Slide-in) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col space-y-4 px-6">
          <NavItemMobile href="/" icon={<Home size={24} />} label="Home" active={pathname === "/"} />
          <NavItemMobile href="/events" icon={<Calendar size={24} />} label="Events" active={pathname === "/event"} />
          <NavItemMobile href="/profile" icon={<User size={24} />} label="Profile" active={pathname === "/profile"} />
        </div>
      </div>
    </nav>
  );
};

// Desktop NavItem
const NavItem = ({ href, icon, label, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        active ? "text-blue-400 bg-gray-800" : "text-gray-400 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

// Mobile NavItem
const NavItemMobile = ({ href, icon, label, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 p-3 text-lg rounded-lg ${
        active ? "text-blue-400 bg-gray-700" : "text-gray-300 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
