import AboutSection from "@/components/home/About";
import ContactSection from "@/components/home/Contact";
import EventHighlightsSection from "@/components/home/EventsHighlight";
import GallerySection from "@/components/home/Gallery";
import HeroSection from "@/components/home/Hero";
import SponsorsSection from "@/components/home/Sponsors";
import TimelineSection from "@/components/home/Timeline";

export default function Home(){
  return(
    <>
    <HeroSection />
    <AboutSection />
    <GallerySection /> {/* Events Carousel */}
    <TimelineSection />
    <EventHighlightsSection /> {/* Fest Highlight */}
    <ContactSection />
    <SponsorsSection />
    </>
  )
}
