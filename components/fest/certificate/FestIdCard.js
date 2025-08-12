"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { FestData } from "@/data/FestData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function FestIdCardPage() {
  const [student, setStudent] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) setStudent(JSON.parse(stored));
  }, []);

  // Student Data
  const festId = student?.festId || "N/A";
  const name = student?.name || "Participant Name";
  const college = student?.college || "Your College";
  const role = student?.role || "Participant";
  const eventName = student?.event || "Registered Event";
  const contact = student?.contact || "+91-XXXXXXXXXX";

  // Fest Data
  const { name: festName, date: festDate, venue: festVenue, tagline: festTagline, sponsors } = FestData;

  // Download PDF Handler
  const downloadPDF = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`FestID_${festId}.pdf`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100">
      
      {/* Top App Bar */}
      <header className="bg-[#001F3F] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Fest Logo" width={32} height={32} />
          <span className="font-semibold text-base">{festName}</span>
        </div>
        <span className="text-xs opacity-80">{festDate}</span>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        
        {/* ID Card */}
        <div className="max-w-sm mx-auto" ref={cardRef}>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101010]">
            
            {/* Pattern Header */}
            <div className="relative p-4 bg-[#001F3F] text-white">
              <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle,_#00CFFF_1px,_transparent_1px)] [background-size:18px_18px]" />
              <div className="relative z-10 text-center">
                <Image src={logo} alt="Fest Logo" width={48} height={48} className="mx-auto mb-1" />
                <h2 className="text-lg font-bold">{festName}</h2>
                <p className="text-xs">{festVenue}</p>
                <p className="text-[10px] italic opacity-80">{festTagline}</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex flex-col items-center">
              <p className="text-[10px] text-gray-500">FEST ID</p>
              <h1 className="text-2xl font-extrabold text-[#00CFFF]">{festId}</h1>

              <p className="mt-2 text-lg font-semibold">{name}</p>
              <p className="text-sm text-gray-500 text-center">{college}</p>
              <p className="text-[12px] font-medium text-[#00CFFF] mt-1 uppercase">{role}</p>
              <p className="text-[11px] text-gray-500 mt-1 italic">Event: {eventName}</p>

              {/* QR */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2 shadow-inner border border-gray-300 dark:border-gray-700 my-4">
                <div className="h-24 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-300">
                  QR / Barcode
                </div>
              </div>

              <p className="text-[10px] text-gray-400">Contact: {contact}</p>
            </div>

            {/* Sponsors */}
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 mb-2">Sponsored by</p>
              <div className="flex flex-wrap justify-center gap-3">{sponsors}</div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={downloadPDF}
            className="bg-[#00CFFF] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#00b3e6] transition"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 text-center text-[10px] text-gray-500 border-t border-gray-200 dark:border-gray-800">
        &copy; {new Date().getFullYear()} {festName}
      </footer>
    </main>
  );
}
