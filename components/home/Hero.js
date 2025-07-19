"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {FestData} from "@/data/FestData";

const BackgroundGlow = () => (
  <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-hidden">
    <div className="w-[60vw] h-[60vw] rounded-full bg-[color:var(--highlight)] opacity-10 blur-[160px]" />
  </div>
);

const HeroSection = () => {
  return (
    <section
      className="relative h-[100vh] w-full flex items-center justify-center text-white px-6 sm:px-12 overflow-hidden"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <BackgroundGlow />

      {/* Particle dots */}
      <div className="absolute top-0 left-0 w-full h-full bg-dot-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/5 backdrop-blur-md p-8 rounded-2xl max-w-3xl text-center shadow-[0_4px_60px_rgba(132,220,207,0.3)] border border-[color:var(--border)] z-10"
        style={{
          backgroundColor: "rgba(11,11,15,0.5)",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-extrabold text-[color:var(--accent)] drop-shadow"
        >
          {FestData.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 text-lg sm:text-xl text-[color:var(--secondary)]"
        >
          {FestData.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/events"
            className="mt-8 inline-block bg-[color:var(--accent)] text-[color:var(--background)] font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-[0_0_20px_rgba(132,220,207,0.5)]"
          >
            Explore Events
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
