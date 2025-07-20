"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
} from "lucide-react";
import { FestData, CollegeData, navItems } from "@/data/FestData";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[color:var(--background)] border-b border-[color:var(--border)] z-50 shadow-lg backdrop-blur-md">
      <div className="flex justify-between items-center mx-auto px-5 md:px-20 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[color:var(--accent)]">
        <img
          src="/favicon.ico"
          alt="Logo"
          className="w-8 h-8 inline-block mr-2"
        />
          {FestData.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-2 items-center">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>

        {/* Hamburger Icon */}
        <button
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
          className="sm:hidden text-[color:var(--accent)]"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[color:var(--background)] bg-opacity-90 border-r border-[color:var(--border)] z-50 backdrop-blur-md transform transition-transform duration-300 ease-in-out sm:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
          <span className="text-lg font-bold text-[color:var(--accent)]">
            {FestData.name}
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="text-[color:var(--accent)]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col px-4 py-6 space-y-2 bg-[color:var(--background)] bg-opacity-90">
          {navItems.map((item) => (
            <NavItemMobile
              key={item.href}
              {...item}
              active={pathname === item.href}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>

        <div className="h-50 flex flex-col px-4 py-6 space-y-2 bg-[color:var(--background)] bg-opacity-90"></div>
      </div>
    </nav>
  );
};

// Desktop Nav Item
const NavItem = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-[color:var(--accent)] text-[color:var(--background)]"
        : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
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
    className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
      active
        ? "bg-[color:var(--accent)] text-[color:var(--background)]"
        : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
