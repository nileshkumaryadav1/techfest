"use client";

import { useState, useEffect } from "react";
import LoadingState from "./myself/LoadingState";

export default function CountdownTimer({
  date,
  time,
  winnerDeclared,
  cancelled,
  loadingText = "Calculating countdown...",
}) {
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date || !time) {
      setCountdown("Invalid date/time");
      setLoading(false);
      return;
    }

    const eventDateTime = new Date(`${date}T${time}`);
    if (isNaN(eventDateTime)) {
      setCountdown("Invalid date/time");
      setLoading(false);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDateTime - now;

      if (cancelled) {
        setCountdown("❌ Event Cancelled");
        setLoading(false);
        return true;
      }

      if (winnerDeclared) {
        setCountdown("✅ Event Completed");
        setLoading(false);
        return true;
      }

      if (diff <= 0) {
        setCountdown("🎉 Event Started");
        setLoading(false);
        return true;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      setLoading(false);
      return false;
    };

    // Initial update
    updateCountdown();

    const interval = setInterval(() => {
      const finished = updateCountdown();
      if (finished) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [date, time, winnerDeclared, cancelled]);

  if (loading) return <LoadingState text={loadingText} />;

  return (
    <p className="text-xs text-[color:var(--accent)] font-semibold mb-2 animate-pulse">
      ⏳ {countdown}
    </p>
  );
}
