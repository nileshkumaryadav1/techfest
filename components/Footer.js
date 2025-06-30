import Link from "next/link";
import { Facebook, Github, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-6 sm:px-16 text-center">
      <div className="mx-auto px-6 grid gap-4 text-center">
        {/* 📌 Navigation Section */}
        <div>
          <ul>
            <Link
              href="/"
              className="hover:text-blue-400 m-2 text-sm text-slate-400"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="hover:text-blue-400 m-2 text-sm text-slate-400"
            >
              Events
            </Link>
            <Link
              href="/developers"
              className="hover:text-blue-400 m-2 text-sm text-slate-400"
            >
              Developers
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-400 m-2 text-sm text-slate-400"
            >
              About
            </Link>
          </ul>
        </div>

        {/* 🌐 Social Media Links */}
        <div>
          <div className="flex justify-center space-x-4 text-sm text-slate-400">
            <a href="" className="hover:text-blue-400">
              <Facebook size={24} />
            </a>
            <a href="" className="hover:text-blue-400">
              <Instagram size={24} />
            </a>
            <a href="" className="hover:text-blue-400">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* 🚀 Copyright Section */}
      <div className="bg-black text-white py-6 px-6 sm:px-16 text-center">
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} TechFest&apos;25 · Built with ❤️ by
          Nilesh Kumar.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
