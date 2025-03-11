import Link from "next/link";
import { Facebook, Github, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="mx-auto px-6 grid gap-4 text-center">
        {/* 📌 Navigation Section */}
        <div>
          <ul>
            <Link href="/" className="hover:text-blue-400 m-2">
              Home
            </Link>
            <Link href="/events" className="hover:text-blue-400 m-2">
              Events
            </Link>
            <Link href="/profile" className="hover:text-blue-400 m-2">
              Profile
            </Link>
          </ul>
        </div>

        {/* 🌐 Social Media Links */}
        <div>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-blue-400">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* 🚀 Copyright Section */}
      <div className="text-center text-gray-300 text-sm mt-6">
        © 2025 TechFest 2025 | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
