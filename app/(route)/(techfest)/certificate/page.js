"use client";

import React, { useState } from "react";
import FestIdCard from "@/components/fest/certificate/FestIdCard";
import ParticipationCertificatePage from "@/components/fest/certificate/ParticipationCert";
import WinnerCertComponent from "@/components/fest/certificate/WinnerCertificatePage";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificateTabsPage() {
  const [activeTab, setActiveTab] = useState("festId");

  const tabs = [
    { id: "festId", label: "🎫 Fest ID Card", component: <FestIdCard /> },
    {
      id: "participation",
      label: "📜 Participation Certificate",
      component: <ParticipationCertificatePage />,
    },
    { id: "winner", label: "🏆 Winner Certificate", component: <WinnerCertComponent /> },
  ];

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-20 text-[color:var(--foreground)]">
      {/* Mobile-Friendly Tab Buttons */}
      <div className="flex flex-col gap-3 mb-8 sm:flex-row sm:gap-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.97 }}
            className={`w-full sm:w-auto px-4 py-3 rounded-xl text-base sm:text-lg font-semibold border shadow-sm transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)] shadow-lg"
                : "bg-[color:var(--surface)] text-[color:var(--foreground)] border-[color:var(--border)] hover:bg-[color:var(--accent-light)] hover:text-white"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 bg-[color:var(--surface)] rounded-xl shadow-md border border-[color:var(--border)]"
        >
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
