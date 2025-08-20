"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { FestData } from "@/data/FestData";
import { FaTrophy, FaCalendarAlt, FaUser, FaHome, FaCertificate } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Nav Data
const navCategories = [
  { href: "/", label: "Home", icon: <FaHome className="text-[color:var(--accent)]" /> },
  {
    label: "Events",
    icon: <FaCalendarAlt className="text-[color:var(--accent)]" />,
    items: [
      { href: "/events", label: "All Events" },
      { href: "/events/upcoming/events", label: "Upcoming Events" },
      { href: "/events/past/events", label: "Past Events" },
      { href: "/registered-event", label: "Enrolled Events" },
      { href: "/schedule", label: "Schedule" },
      { href: "/hof", label: "Hall of Fame" },
    ],
  },
  { href: "/certificate", label: "Certificate", icon: <FaCertificate className="text-[color:var(--accent)]" /> },
  { href: "/dashboard", label: "Profile", icon: <FaUser className="text-[color:var(--accent)]" /> },
  {
    label: "Management",
    icon: <FaUser className="text-[color:var(--accent)]" />,
    items: [
      { href: "/contact", label: "Organizers" },
      { href: "/campus-ambassadors", label: "Campus Ambassadors" },
      { href: "/coordinators", label: "Coordinators" },
      { href: "/sponsors", label: "Sponsors" },
      { href: "/about", label: "About Fest" },
      { href: "/developers", label: "Developers" },
    ],
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  // Prevent background scroll on mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[color:var(--background)]/70 border-b border-[color:var(--border)] shadow-md">
      <div className="flex justify-between items-center mx-auto px-5 md:px-20 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-[color:var(--accent)] flex items-center"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-9 h-9 inline-block mr-2 border border-[color:var(--border)] rounded-full shadow"
          />
          {FestData.name}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-6 items-center">
          {navCategories.map((cat) =>
            cat.items ? (
              <div
                key={cat.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(cat.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname.includes(cat.label.toLowerCase())
                      ? "text-[color:var(--accent)]"
                      : "text-[color:var(--secondary)] group-hover:text-[color:var(--accent)]"
                  }`}
                >
                  {cat.icon} {cat.label}
                  <ChevronDown size={16} />
                </button>

                <AnimatePresence>
                  {openDropdown === cat.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-56 bg-[color:var(--background)]/95 backdrop-blur-xl border border-[color:var(--border)] rounded-xl shadow-lg py-3"
                    >
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2 px-5 py-2 text-sm rounded-md transition ${
                            pathname === item.href
                              ? "bg-[color:var(--accent)] text-[color:var(--background)]"
                              : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                          }`}
                        >
                          <FaTrophy className="text-xs" /> {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={cat.href}
                href={cat.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition ${
                  pathname === cat.href
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--secondary)] hover:text-[color:var(--accent)]"
                }`}
              >
                {cat.icon} {cat.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-[color:var(--accent)]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Fullscreen Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 h-screen w-screen bg-[color:var(--background)]/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border)]">
              <span className="text-lg font-bold text-[color:var(--accent)]">
                {FestData.name}
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="text-[color:var(--accent)]"
              >
                <X size={30} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {navCategories.map((cat) =>
                cat.items ? (
                  <div key={cat.label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown(
                          openMobileDropdown === cat.label ? null : cat.label
                        )
                      }
                      className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-lg font-medium text-[color:var(--secondary)] hover:bg-[color:var(--accent)]/20 transition"
                    >
                      <span className="flex items-center gap-2">
                        {cat.icon} {cat.label}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          openMobileDropdown === cat.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openMobileDropdown === cat.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 ml-6 space-y-2"
                        >
                          {cat.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base transition ${
                                pathname === item.href
                                  ? "bg-[color:var(--accent)] text-[color:var(--background)]"
                                  : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                              }`}
                            >
                              <FaTrophy className="text-sm" /> {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-md text-lg transition ${
                      pathname === cat.href
                        ? "bg-[color:var(--accent)] text-[color:var(--background)]"
                        : "text-[color:var(--secondary)] hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
