"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({
  date,
  time,
  winnerDeclared,
  cancelled,
}) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!date || !time) return;

    const eventDateTime = new Date(`${date}T${time}`);
    if (isNaN(eventDateTime)) {
      setCountdown("Invalid date/time");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = eventDateTime - now;

      if (cancelled) {
        setCountdown("❌ Event Cancelled");
        clearInterval(interval);
        return;
      }

      if (winnerDeclared) {
        setCountdown("✅ Event Ended");
        clearInterval(interval);
        return;
      }

      if (diff <= 0) {
        setCountdown("🎉 Event Started");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [date, time, winnerDeclared, cancelled]);

  if (!countdown) return null;

  return (
    <p className="text-xs text-[color:var(--accent)] font-semibold mb-2 animate-pulse">
      ⏳ {countdown}
    </p>
  );
}
