import { Orbitron } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { FestData } from "@/data/FestData";
import ClientWrapper from "./client-wrapper";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata = {
  title: `${FestData.name} | ${FestData.theme} - ${FestData.tagline}`,
  description: FestData.description,
  keywords: "techfest, events, competitions, gaming, coding",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: `${FestData.name} | ${FestData.theme}`,
    description: FestData.description,
    url: FestData.url,
    type: "website",
    images: [
      {
        url: FestData.ogImage,
        width: 1200,
        height: 630,
        alt: FestData.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FestData.name} | ${FestData.theme}`,
    description: FestData.description,
    image: FestData.ogImage,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable}`}>
      <body>
        <SessionProviderWrapper>
          {/* Only wrap interactive components in ClientWrapper */}
          <ClientWrapper>{children}</ClientWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
