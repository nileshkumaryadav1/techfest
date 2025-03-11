import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Techfest 2025 | The Future of Technology",
  description:
    "Techfest 2025 | Experience the future of technology with innovation, competitions, and knowledge sharing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <SessionProviderWrapper>
          <main className="font-[family-name:var(--font-geist-mono)] md:mt-15 mt-12">
            {children}
          </main>
        </SessionProviderWrapper>
        <MobileNavbar />
        <Footer />
      </body>
    </html>
  );
}
