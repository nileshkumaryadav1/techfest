"use client";

import { useEffect, useState } from "react";
import { FestData } from "@/data/FestData";

// Convert "18-09-2025" → Date
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function FestCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!FestData?.startDate) return;

    const festStart = parseDate(FestData.startDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = festStart - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center px-2 py-2">
      {/* Title */}
      <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent animate-pulse">
        ⏳ Countdown to Fest 🎉
      </h2>

      {/* Countdown Blocks */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md sm:max-w-2xl">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-xl shadow-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-2 py-3 sm:px-4 sm:py-6"
          >
            <span className="text-lg sm:text-3xl md:text-4xl font-extrabold tracking-wide">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-sm uppercase mt-1 font-medium opacity-90">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Fest Date */}
      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-base md:text-lg mt-4 sm:mt-6">
        📅 Fest Dates:{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {FestData.date}
        </span>
      </p>
    </div>
  );
}
