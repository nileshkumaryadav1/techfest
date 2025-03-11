"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, Menu, X, Presentation } from "lucide-react";
// import { useSession } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 py-3 shadow-md z-50">
      <div className="flex justify-between items-center mx-auto md:px-20 px-5">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-100">
          <Link href="/">TechFest&apos;25</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex space-x-2">
          <NavItem
            href="/"
            icon={<Home size={24} />}
            label="Home"
            active={pathname === "/"}
          />
          <NavItem
            href="/events"
            icon={<Calendar size={24} />}
            label="Events"
            active={pathname === "/events"}
          />
          <NavItem
            href="/registered-event"
            icon={<Presentation size={24} />}
            label="Enrolled"
            active={pathname === "/registered-event"}
          />
          <NavItem
            href="/dashboard"
            icon={<User size={24} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
          {/* {session ? (
              <NavItem
              href="/dashboard"
              icon={<User size={24} />}
              label="Dashboard"
              active={pathname === "/dashboard"}
            />
          ) : (
            <NavItem
            href="/login"
            icon={<User size={24} />}
            label="Login"
            active={pathname === "/login"}
          />
          )} */}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-white"
        >
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

        <div className="flex flex-col px-6">
          <NavItemMobile
            href="/"
            icon={<Home size={24} />}
            label="Home"
            active={pathname === "/"}
          />
          <NavItemMobile
            href="/events"
            icon={<Calendar size={24} />}
            label="Events"
            active={pathname === "/events"}
          />
          <NavItemMobile
            href="/registered-event"
            icon={<Presentation size={24} />}
            label="Enrolled"
            active={pathname === "/registered-event"}
          />
          <NavItemMobile
            href="/dashboard"
            icon={<User size={24} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
          {/* {session ? (
              <NavItemMobile
              href="/dashboard"
              icon={<User size={24} />}
              label="Dashboard"
              active={pathname === "/dashboard"}
            />
          ) : (
            <NavItemMobile
            href="/login"
            icon={<User size={24} />}
            label="Login"
            active={pathname === "/login"}
          />
          )} */}
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
