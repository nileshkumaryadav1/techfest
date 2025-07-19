// layout.js
import { Orbitron } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { FestData } from "@/data/FestData";

// Load custom fonts with CSS variables
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

// Page metadata
export const metadata = {
  title: FestData.name + " | " + FestData.theme + "-"+ FestData.tagline,
  description: FestData.description,  
};

// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body>
        <SessionProviderWrapper>
          <Navbar />
          <main className="mt-12 md:mt-16">
            {children}
          </main>
          {/* <MobileNavbar /> */}
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
