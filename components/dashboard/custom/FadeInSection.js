"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FadeInSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.2, // 40% of the section must be visible to trigger
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
