import AboutSection from "@/components/home/About";
import ContactSection from "@/components/home/Contact";
import GallerySection from "@/components/home/Gallery";
import HeroSection from "@/components/home/Hero";
import EventHighlightsSection from "@/components/home/Highlights";
import SponsorsSection from "@/components/home/Sponsors";
import TimelineSection from "@/components/home/Timeline";


export default function Home(){
  return(
    <>
    <HeroSection />
    <EventHighlightsSection />
    <GallerySection />
    <SponsorsSection />
    <TimelineSection />
    <AboutSection />
    <ContactSection />
    </>
  )
}