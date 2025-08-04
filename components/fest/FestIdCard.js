"use client";
import React, { useEffect, useState } from "react";

function FestIdCard() {
  const [student, setStudent] = useState();

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, []);

  const festId = student?.festId || "N/A";
  const name = student?.name || "Participant";
  const college = student?.college || "Your College";

  return (
    <div className="w-full max-w-sm mx-auto p-1 rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-purple-600 shadow-2xl mt-6">
      <div className="bg-white dark:bg-gray-900 text-center rounded-2xl px-6 py-5 shadow-inner relative overflow-hidden">
        {/* Ribbon */}
        <div className="absolute top-0 right-0 bg-[color:var(--accent)] text-white text-xs px-3 py-1 rounded-bl-xl font-semibold shadow-md">
          FEST ID CARD
        </div>

        {/* Fest ID */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Your Fest ID</p>
        <h1 className="text-3xl font-bold tracking-wider text-[color:var(--accent)] mb-3 break-words">
          {festId}
        </h1>

        {/* Student Name */}
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{college}</p>

        {/* QR/Barcode Placeholder */}
        <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-12 w-32 mx-auto rounded-lg flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
          QR / Barcode
        </div>
      </div>
    </div>
  );
}

export default FestIdCard;
