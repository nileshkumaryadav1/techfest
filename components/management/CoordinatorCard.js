"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Users } from "lucide-react";

export default function CoordinatorCard({ event }) {
  if (!event || !event.coordinators?.length) return null;

  const { title = "Untitled Event", coordinators = [] } = event;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col h-full rounded-2xl border border-[color:var(--border)] shadow-md hover:shadow-lg transition duration-300 overflow-hidden bg-white/5 backdrop-blur-md"
    >
      {/* Header */}
      <div className="p-4 border-b border-[color:var(--border)] bg-white/10">
        <h3 className="text-lg font-bold text-[color:var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm text-[color:var(--secondary)] flex items-center gap-1 mt-1">
          <Users size={14} /> Event Coordinators
        </p>
      </div>

      {/* Coordinators List */}
      <div className="flex flex-col flex-1 p-4 text-sm text-gray-600 space-y-4">
        {coordinators.map((coordinator, i) => (
          <div
            key={i}
            className="rounded-lg bg-white/5 p-3 border border-white/10"
          >
            <h4 className="font-medium text-[color:var(--foreground)]">
              {coordinator.name || "Unnamed Coordinator"}
            </h4>

            {coordinator.contact && (
              <p className="flex items-center gap-2 mt-1">
                <Phone size={14} className="text-[color:var(--accent)]" />
                <a
                  href={`tel:${coordinator.contact}`}
                  className="hover:underline text-[color:var(--accent)]"
                >
                  {coordinator.contact}
                </a>
              </p>
            )}

            {coordinator.email && (
              <p className="flex items-center gap-2 mt-1">
                <Mail size={14} className="text-[color:var(--accent)]" />
                <a
                  href={`mailto:${coordinator.email}`}
                  className="hover:underline"
                >
                  {coordinator.email}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
