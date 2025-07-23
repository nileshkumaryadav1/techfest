import Link from "next/link";
import { Facebook, Github, Instagram, Twitter, Linkedin } from "lucide-react";
import { FestData, developersData, footerNavItems } from "@/data/FestData"; // adjust path if needed

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { facebook, instagram, twitter, linkedin, github } = FestData.socialMedia;

  return (
    <footer className="bg-black text-white px-6 py-10 sm:px-16 text-center space-y-6">
      {/* 📌 Navigation Links */}
      <nav aria-label="Footer navigation">
        <ul className="flex justify-center flex-wrap gap-4">
          {footerNavItems.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-slate-400 hover:text-[color:var(--accent)] transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 🌐 Social Icons */}
      <div className="flex justify-center gap-6">
        {facebook && (
          <Link href={facebook} target="_blank" aria-label="Facebook" className="text-slate-400 hover:text-blue-400 transition">
            <Facebook size={24} />
          </Link>
        )}
        {instagram && (
          <Link href={instagram} target="_blank" aria-label="Instagram" className="text-slate-400 hover:text-pink-400 transition">
            <Instagram size={24} />
          </Link>
        )}
        {twitter && (
          <Link href={twitter} target="_blank" aria-label="Twitter" className="text-slate-400 hover:text-sky-400 transition">
            <Twitter size={24} />
          </Link>
        )}
        {linkedin && (
          <Link href={linkedin} target="_blank" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-500 transition">
            <Linkedin size={24} />
          </Link>
        )}
        {github && (
          <Link href={github} target="_blank" aria-label="GitHub" className="text-slate-400 hover:text-gray-300 transition">
            <Github size={24} />
          </Link>
        )}
      </div>

      {/* 🚀 Copyright */}
      <div className="pb-4">
        <p className="text-sm text-slate-400 md:flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-5 h-5 inline-block" /> {" "}
          &copy; {currentYear} {FestData.name} ·
          <p> Built with ❤️ by{" "}</p>
          <Link href={developersData[0].portfolio} target="_blank" className="hover:text-[color:var(--accent)] underline">
            {developersData[0].name}
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
