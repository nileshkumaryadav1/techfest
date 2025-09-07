"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import logo from "@/public/logo.png";
import { CollegeData, FestData } from "@/data/FestData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

export default function FestIdCardPage() {
  const [student, setStudent] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("student");
      if (stored) {
        try {
          setStudent(JSON.parse(stored));
        } catch (err) {
          console.error("Invalid student data in localStorage", err);
        }
      }
    }
  }, []);

  const festId = student?.festId || "N/A";
  const name = student?.name || "Participant Name";
  const college = student?.college || "Your College";
  const role = student?.role || "Participant";
  const eventName = student?.event || "N/A";
  const contact = student?.phone || "+91-XXXXXXXXXX";
  const photoUrl = student?.photo || "/icons8-user-100.png";

  const { name: festName, venue: festVenue, sponsors } = FestData;
  const { name: collegeName, address: collegeAddress, logo: collegeLogo } = CollegeData;

  const qrData = JSON.stringify({ festId, name, college, event: eventName });

  const downloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      // Use higher scale for sharper image
      const scale = window.devicePixelRatio * 2;

      const canvas = await html2canvas(cardRef.current, {
        scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (doc) => {
          doc.querySelectorAll("*").forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#ffffff";
            if (style.color.includes("oklch")) el.style.color = "#000000";
            if (style.borderColor.includes("oklch")) el.style.borderColor = "#000000";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      // PDF: CR80 ID card 86x54 mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [54, 86],
      });

      // Add a tiny margin to avoid clipping
      const margin = 1.5; // mm
      const pdfWidth = 86 - 2 * margin;
      const pdfHeight = 54 - 2 * margin;

      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
      pdf.save(`FestID_${festId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center bg-[#f3f4f6] px-4 py-6">
      <div
        ref={cardRef}
        className="w-[343px] h-[215px] bg-white border-2 border-[#374151] rounded-xl shadow-xl overflow-hidden flex flex-col p-[3px]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001F3F] to-[#004080] text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide">{festName}</h2>
              <p className="text-[9px] opacity-80">{festVenue}</p>
            </div>
            <Image src={logo} alt="Fest Logo" width={28} height={28} className="rounded-full border border-white" priority />
          </div>
          <div className="flex items-center gap-2">
            <Image src={collegeLogo} alt="College Logo" width={28} height={28} className="rounded-full border border-white" priority />
            <div>
              <h2 className="text-xs font-medium">{collegeName}</h2>
              <p className="text-[8px] opacity-80">{collegeAddress}</p>
            </div>
          </div>
        </div>

        {/* Middle */}
        <div className="flex-1 flex px-3 py-2 gap-3">
          <div className="w-[75px] h-[95px] border-2 border-[#00CFFF] rounded-md bg-[#f3f4f6] flex items-center justify-center text-[8px] font-medium">
            {photoUrl ? (
              <Image src={photoUrl} alt="Student" width={75} height={95} className="object-cover w-full h-full rounded-sm" />
            ) : "PHOTO"}
          </div>

          <div className="flex-1 flex flex-col justify-center text-[9px] leading-snug">
            <p className="text-[8px] text-[#6b7280] font-medium">FEST ID</p>
            <h1 className="text-lg font-extrabold text-[#00CFFF] tracking-wide">{festId}</h1>
            <p className="font-semibold text-[12px]">{name}</p>
            <p className="text-[8.5px] text-[#4b5563]">{college}</p>
            <p className="text-[9px] text-[#001F3F] font-bold uppercase mt-1">{role}</p>
            <p className="text-[8px] italic text-[#6b7280]">Event: {eventName}</p>
            <p className="text-[7px] text-[#9ca3af] mt-1">Contact: {contact}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded bg-[#e5e7eb] text-[7px] flex items-center justify-center shadow-inner">
              <QRCodeSVG value={qrData} size={54} />
            </div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="bg-[#f9fafb] border-t border-[#e5e7eb] px-2 py-1 text-center">
          <p className="text-[7px] text-[#6b7280] font-medium">Sponsored by</p>
          <div className="text-[6.5px] flex flex-wrap justify-center gap-1">{sponsors}</div>
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-5 bg-[#00CFFF] hover:bg-[#009FCC] transition-colors text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-md"
      >
        Download ID Card (PDF)
      </button>
    </main>
  );
}
