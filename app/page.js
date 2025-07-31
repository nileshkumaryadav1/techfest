"use client";
import { useEffect, useRef, useState } from "react";
import AboutSection from "@/components/home/About";
import ContactSection from "@/components/home/Contact";
import EventHighlightsSection from "@/components/home/EventsHighlight";
import GallerySection from "@/components/home/Gallery";
import HeroSection from "@/components/home/Hero";
import SponsorsSection from "@/components/home/Sponsors";
import TimelineSection from "@/components/home/Timeline";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const totalHeight = document.body.scrollHeight;

      // If user has reached bottom of page
      if (scrollPosition >= totalHeight - 50) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Sections */}
      <HeroSection />
      <AboutSection />
      <GallerySection /> {/* Events Carousel */}
      <TimelineSection />
      <EventHighlightsSection /> {/* Fest Highlight */}
      <ContactSection />
      <SponsorsSection />

      {/* Scroll to Top Button (only visible at bottom) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed md:bottom-6 md:right-6 bottom-17 right-4 px-4 py-3 text-sm font-semibold rounded-full z-50 shadow-lg transition duration-300 border rounded-full hover:cursor-pointer"
        >
          ↑ Back to Top
        </button>
      )}
    </>
  );
}
