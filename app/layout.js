// layout.js
import { Orbitron } from "next/font/google";
import "./globals.css";

import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { FestData } from "@/data/FestData";
import ClientWrapper from "./client-wrapper"; // new wrapper

// Load custom fonts with CSS variables
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

// Page metadata
export const metadata = {
  title: FestData.name + " | " + FestData.theme + "-" + FestData.tagline,
  description: FestData.description,
};

// Root Layout (Server Component)
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body>
        <SessionProviderWrapper>
          {/* Pass children into a client wrapper */}
          <ClientWrapper>{children}</ClientWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
