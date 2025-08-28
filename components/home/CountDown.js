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
    <div className="flex flex-col items-center justify-center text-center p-2 sm:p-10">
      <h2 className="text-lg sm:text-4xl font-extrabold md:mb-6 mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent animate-pulse">
        ⏳ Countdown to Fest 🎉
      </h2>

      {/* Countdown Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:gap-4 gap-2 sm:gap-6 w-full max-w-2xl">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-4 md:py-6 py-2 sm:py-8 transform hover:scale-105 transition-all duration-300"
          >
            <span className="text-3xl sm:text-5xl font-extrabold tracking-widest">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-sm sm:text-base uppercase mt-2 font-medium tracking-wide opacity-90">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Fest Date */}
      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-lg md:mt-8 mt-2">
        📅 Fest Dates:{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {FestData.date}
        </span>
      </p>
    </div>
  );
}
