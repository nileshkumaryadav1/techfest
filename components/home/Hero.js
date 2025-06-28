"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      className="relative h-[100vh] w-full bg-gradient-to-br from-[#0D1117] via-[#1e1f3b] to-[#0D1117] flex items-center justify-center text-white px-6 sm:px-12"
      style={{
        backgroundImage: "url('')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-xl max-w-2xl text-center shadow-xl">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-bold text-[#00F0FF]"
        >
          TechFest&apos;25
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 text-lg sm:text-xl text-slate-200"
        >
          Experience the future of technology through innovation, competition, and collaboration.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/events"
            className="mt-8 inline-block bg-[#00F0FF] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#00d0dd] transition shadow-md"
          >
            Explore Events
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
