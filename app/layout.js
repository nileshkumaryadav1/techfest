// app/layout.tsx

import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

// Load custom fonts with CSS variables
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

// Page metadata
export const metadata = {
  title: "Techfest 2025 | The Future of Technology",
  description:
    "Techfest 2025 | Experience the future of technology with innovation, competitions, and knowledge sharing.",
};

// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}>
      <body className="antialiased bg-white text-black dark:bg-zinc-900 dark:text-white">
        <SessionProviderWrapper>
          <Navbar />
          <main className="mt-12 md:mt-16 font-sans">
            {children}
          </main>
          <MobileNavbar />
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
